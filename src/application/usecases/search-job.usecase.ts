import { JobRepository } from "@/domain/job/repository/job.repository";
import { Job } from "../../domain/job/entity/job.entity";
import { UseCase } from "./usecase.contract";
import { JobListFetcher } from "../contracts/job-list-fetcher";
import { JobDetailFetcher } from "../contracts/job-detail-fetcher";
import { defaultConfig } from "@/config/bot.config";

interface SearchJobInput {
  query: string;
  filters: Record<string, any>;
}

type SearchJobOutput = Job[];

export class SearchJobUseCase
  implements UseCase<SearchJobInput, SearchJobOutput>
{
  constructor(
    private readonly listFetcher: JobListFetcher,
    private readonly detailFetcher: JobDetailFetcher,
    private readonly jobRepository: JobRepository
  ) {}

  public async execute(input: SearchJobInput): Promise<SearchJobOutput> {
    let page = 0;
    let hasNextPage = true;
    const perPage = defaultConfig.job.pageSize;
    const jobs: Job[] = [];

    while (hasNextPage) {
      const { rawJobs, hasNextPage: next } = await this.listFetcher.fetch(
        input.query,
        input.filters,
        page,
        perPage
      );
      hasNextPage = next;
      page++;

      for (const summary of rawJobs) {
        const jobAlreadExists = await this.jobRepository.findOne(summary.jobId);

        if (jobAlreadExists) break;

        const details = await this.detailFetcher.fetch(summary.jobId);

        if (!details) {
          throw new Error("Error fetching job details");
        }

        const job = Job.create(
          summary.jobId,
          summary.title,
          summary.company,
          summary.url,
          details.content,
          details.postedDate,
          summary.location
        );

        jobs.push(job);
        await this.jobRepository.save(job);
      }
    }

    return jobs;
  }
}
