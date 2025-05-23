export interface JobNotificationDto {
  type: "job";
  title: string;
  company: string;
  location?: string;
  score: number;
  link: string;
}

export interface PostNotificationDto {
  type: "post";
  author: string;
  content: string;
  score: number;
  link: string;
}

export type NotifiableItemDto = JobNotificationDto | PostNotificationDto;
