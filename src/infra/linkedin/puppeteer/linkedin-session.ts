import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs/promises";
import path from "path";
import { logger } from "@/utils/logger";

puppeteer.use(StealthPlugin());

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";

const COOKIES_PATH = path.resolve(__dirname, "cookies.json");

export class LinkedinSession {
  private async initialize(): Promise<{ browser: Browser; page: Page }> {
    logger.info("Inicializando sessão do LinkedIn...");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    logger.info("Navegador iniciado com sucesso");

    await this.loadCookies(browser);

    const page = await browser.newPage();
    logger.info("Nova página criada");

    await page.setUserAgent(USER_AGENT);
    logger.info("User agent configurado");

    logger.info("Navegando para a página de login do LinkedIn...");
    await page.goto("https://www.linkedin.com/login");

    const url = page.url();
    const isLoginPage = url.includes("/login");

    if (isLoginPage) {
      logger.info("Login necessário. Tentando login automático...");
      // Fazer login manual
      await page.type("#username", process.env.LINKEDIN_USER!);
      await page.type("#password", process.env.LINKEDIN_PASSWORD!);
      logger.info("Enviando credenciais de login...");
      await page.click("button[type=submit]");

      await page.waitForNavigation();
      logger.success("Login realizado com sucesso");
      await this.saveCookies(browser);
    } else {
      logger.success("Já logado com cookies existentes");
    }

    return { browser, page };
  }

  private async loadCookies(browser: Browser): Promise<void> {
    logger.info("Tentando carregar cookies...");
    try {
      const cookiesJson = await fs.readFile(COOKIES_PATH, "utf-8");
      const cookies = JSON.parse(cookiesJson);
      await browser.setCookie(...cookies);
      logger.success("Cookies carregados com sucesso");
    } catch {
      logger.warn("Nenhum cookie encontrado, login manual será necessário");
    }
  }

  private async saveCookies(browser: Browser): Promise<void> {
    logger.info("Salvando cookies...");
    const cookies = await browser.cookies();
    await fs.writeFile(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    logger.success("Cookies salvos com sucesso");
  }

  public async extractQueriesId(): Promise<{
    jobQueryId: string;
    postQueryId: string;
  }> {
    logger.info("Extraindo IDs de consulta do LinkedIn...");
    const { browser, page } = await this.initialize();

    let jobQueryId = "";
    let postQueryId = "";

    logger.info(
      "Monitorando requisições de rede para obter IDs de consulta..."
    );
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("voyagerJobsDashJobPostingDetailSections") &&
        url.includes("queryId=")
      ) {
        const match = url.match(/queryId=([a-zA-Z0-9.]+)/);
        if (match) {
          jobQueryId = match[1];
        }
      }
    });
    await page.goto("https://www.linkedin.com/jobs/search");

    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("voyagerSearchDashClusters") &&
        url.includes("queryId=")
      ) {
        const match = url.match(/queryId=([a-zA-Z0-9.]+)/);
        if (match) {
          postQueryId = match[1];
          logger.success(`ID de consulta de jobs encontrado: ${jobQueryId}`);
          logger.success(`ID de consulta de posts encontrado: ${postQueryId}`);
        }
      }
    });
    await page.goto("https://www.linkedin.com/search/results/all/");
    await browser.close();

    return { jobQueryId, postQueryId };
  }
}
