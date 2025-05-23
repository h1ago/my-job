import { Notifier } from "@/domain/services/notifier";
import { NotifiableItemDto } from "@/domain/dto/notifiable-item.dto";
import { formatTelegramMessage } from "@/application/presenters/telegram.presenter";

import TelegramBot from "node-telegram-bot-api";
import { logger } from "@/utils/logger";

export class TelegramNotifier implements Notifier {
  private readonly telegramBot: TelegramBot;
  private readonly chatId: string;

  constructor() {
    this.telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
      polling: false,
    });
    this.chatId = process.env.TELEGRAM_CHAT_ID!;
  }

  async notify(items: NotifiableItemDto[]): Promise<void> {
    logger.info(`Notificando ${items.length} resultado(s) relevante(s).`);

    for (const item of items) {
      const message = formatTelegramMessage(item);
      await this.telegramBot.sendMessage(this.chatId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    }
  }

  async notifyError(message: string): Promise<void> {
    await this.telegramBot.sendMessage(this.chatId, message, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  }
}
