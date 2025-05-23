import { NotifiableItemDto } from "@/domain/dto/notifiable-item.dto";
import { Job } from "@/domain/job/entity/job.entity";

export function mapJobToNotifiableItemDto(job: Job): NotifiableItemDto {
  return {
    type: "job",
    title: job.title,
    company: job.company,
    location: job.location,
    score: job.score,
    link: job.link,
  };
}
