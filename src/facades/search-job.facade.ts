import { EvaluateContentByCriteriaUseCase } from "@/application/usecases/evaluate-content-by-criteria.usecase";
import { NotifyRelevantOpportunitiesUseCase } from "@/application/usecases/notify-relevant-opportunities.usecase";
import { SearchJobUseCase } from "@/application/usecases/search-job.usecase";
import { LinkedInSearchConfig } from "@/config/types/LinkedInSearchConfig";
import { Job } from "@/domain/job/entity/job.entity";
import { KeywordContentEvaluator } from "@/domain/services/keywords.content-evaluator";
import { LinkedInJobDetailtFetcher } from "@/infra/linkedin/fetchers/linkedin-job-detail-fetcher";
import { LinkedInJobListFetcher } from "@/infra/linkedin/fetchers/linkedin-job-list-fetcher";
import { TelegramNotifier } from "@/infra/notifiers/telegram-notifier";
import { FileRepository } from "@/infra/persistence/file-repository.fs";

export class SearchJobFacade {
  private search: SearchJobUseCase;
  private evaluate: EvaluateContentByCriteriaUseCase<Job>;
  private notify: NotifyRelevantOpportunitiesUseCase;

  constructor(queryId: string) {
    const repo = new FileRepository("jobs-data.json", Job.with);
    const evaluator = new KeywordContentEvaluator();
    const notifier = new TelegramNotifier();

    this.search = new SearchJobUseCase(
      new LinkedInJobListFetcher(),
      new LinkedInJobDetailtFetcher(queryId),
      repo
    );

    this.evaluate = new EvaluateContentByCriteriaUseCase<Job>(evaluator, repo);
    this.notify = new NotifyRelevantOpportunitiesUseCase(notifier);
  }

  async execute(config: LinkedInSearchConfig) {
    const jobs = await this.search.execute({
      query: config.query,
      filters: config.filters,
    });
    const scored = await this.evaluate.execute({
      items: jobs,
      criterias: config.criterias,
      extractContent: (job) => job.content,
    });
    await this.notify.execute({
      items: scored,
      minScoreToNotify: config.minScoreToNotify,
    });
  }
}
