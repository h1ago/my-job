import { NotifiableItemDto } from "../dto/notifiable-item.dto";

export interface Notifier {
  notify(items: NotifiableItemDto[]): Promise<void>;
  notifyError(message: string): Promise<void>;
}
