import { BotConfig } from "./types/BotConfig";

export const defaultConfig: BotConfig = {
  job: {
    pageSize: 100,
  },
  post: {
    pageSize: 50,
  },
  schedule: {
    interval: 5,
    days: [1, 2, 3, 4, 5], // Segunda a sexta
    hours: {
      start: 8,
      end: 20,
    },
  },
};
