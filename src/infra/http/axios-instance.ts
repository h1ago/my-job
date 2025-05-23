import axios, { RawAxiosRequestHeaders } from "axios";
import path from "path";
import fs from "fs";

export const axiosInstance = axios.create({
  headers: buildLinkedInHeaders(),
});

function buildLinkedInHeaders(): RawAxiosRequestHeaders {
  const COOKIES_FILE = path.resolve(
    __dirname,
    "../linkedin/puppeteer/cookies.json"
  );
  const rawCookies = JSON.parse(fs.readFileSync(COOKIES_FILE, "utf-8"));
  const cookieHeader = rawCookies
    .map((c: any) => `${c.name}=${c.value}`)
    .join("; ");
  const jsession = rawCookies.find((c: any) => c.name === "JSESSIONID");
  const csrfToken = jsession ? jsession.value.replace(/"/g, "") : "";

  const headers = {
    "csrf-token": csrfToken,
    cookie: cookieHeader,
    "x-restli-protocol-version": "2.0.0",
    accept: "application/json",
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  };

  return headers;
}
