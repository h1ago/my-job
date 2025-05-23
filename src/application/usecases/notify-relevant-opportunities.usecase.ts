import { Notifier } from "@/domain/services/notifier";
import { UseCase } from "./usecase.contract";
import { Post } from "@/domain/post/entity/post.entity";
import { Job } from "@/domain/job/entity/job.entity";
import { mapJobToNotifiableItemDto } from "../mappers/job-to-dto.mapper";
import { mapPostToNotifiableItemDto } from "../mappers/post-to-dto.mapper";

interface NotifyInput {
  items: Job[] | Post[];
  minScoreToNotify: number;
}

type NotifyOutput = void;

export class NotifyRelevantOpportunitiesUseCase
  implements UseCase<NotifyInput, NotifyOutput>
{
  constructor(private readonly notifier: Notifier) {}

  async execute(input: NotifyInput): Promise<void> {
    const { items, minScoreToNotify } = input;

    const notifiableItems = items
      .filter((item) => item.score >= minScoreToNotify)
      .map((item) =>
        item instanceof Job
          ? mapJobToNotifiableItemDto(item)
          : mapPostToNotifiableItemDto(item)
      );

    await this.notifier.notify(notifiableItems);
  }
}
