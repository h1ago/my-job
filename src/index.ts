import dotenv from "dotenv";
import { LinkedinSession } from "@/infra/linkedin/puppeteer/linkedin-session";
import { LinkedInSearchConfig } from "@/config/types/LinkedInSearchConfig";
import { defaultConfig } from "@/config/bot.config";
import { SearchJobFacade } from "@/facades/search-job.facade";
import { SearchPostFacade } from "@/facades/search-post.facade";
import { isScheduleValid } from "@/utils/schedule";
import { TelegramNotifier } from "@/infra/notifiers/telegram-notifier";
import SEARCH_CONFIGS from "@/config/search.config";
import { logger } from "@/utils/logger";

dotenv.config();

const searchConfigs: LinkedInSearchConfig[] = SEARCH_CONFIGS;

async function main() {
  logger.info("Bot iniciando...");
  const session = new LinkedinSession();
  const { jobQueryId, postQueryId } = await session.extractQueriesId();

  const searchJobFacade = new SearchJobFacade(jobQueryId);
  const searchPostFacade = new SearchPostFacade(postQueryId);

  const loop = async () => {
    if (!isScheduleValid(defaultConfig.schedule)) return;

    for (const searchConfig of searchConfigs) {
      if (searchConfig.searchType === "job") {
        await searchJobFacade.execute(searchConfig);
      } else {
        await searchPostFacade.execute(searchConfig);
      }
    }

    logger.success("Iteração concluída, aguardando próximo ciclo...");
  };

  setInterval(loop, defaultConfig.schedule.interval * 60 * 1000);

  await loop().catch((error) => {
    logger.error("Erro durante a execução da aplicação:", error);
    new TelegramNotifier().notifyError(
      "Houve um erro durante a execução da aplicação"
    );
  });
}

main();
