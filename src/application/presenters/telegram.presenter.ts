import { NotifiableItemDto } from "@/domain/dto/notifiable-item.dto";

export function formatTelegramMessage(item: NotifiableItemDto): string {
  if (item.type === "job") {
    return `
📢 *Nova Vaga Encontrada!*
🏢 Empresa: *${item.company}*
📌 Título: *${item.title}*
📍 Local: *${item.location || "Não informado"}*
⭐️ Score: ${item.score}
🔗 [Ver vaga](${item.link})
    `.trim();
  }

  return `
📢 *Nova Publicação de Vaga!*
👤 Autor: *${item.author}*
⭐️ Score: ${item.score}
🔗 [Ver publicação](${item.link})
  `.trim();
}
