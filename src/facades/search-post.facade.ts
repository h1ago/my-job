import { EvaluateContentByCriteriaUseCase } from "@/application/usecases/evaluate-content-by-criteria.usecase";
import { NotifyRelevantOpportunitiesUseCase } from "@/application/usecases/notify-relevant-opportunities.usecase";
import { SearchPostUseCase } from "@/application/usecases/search-post.usecase";
import { LinkedInSearchConfig } from "@/config/types/LinkedInSearchConfig";
import { Post } from "@/domain/post/entity/post.entity";
import { KeywordContentEvaluator } from "@/domain/services/keywords.content-evaluator";
import { LinkedInPostListFetcher } from "@/infra/linkedin/fetchers/linkedin-post-list-fetcher";
import { TelegramNotifier } from "@/infra/notifiers/telegram-notifier";
import { FileRepository } from "@/infra/persistence/file-repository.fs";

export class SearchPostFacade {
  private readonly search: SearchPostUseCase;
  private readonly evaluate: EvaluateContentByCriteriaUseCase<Post>;
  private readonly notify: NotifyRelevantOpportunitiesUseCase;
  private readonly repo: FileRepository<Post>;

  constructor(queryId: string) {
    const evaluator = new KeywordContentEvaluator();
    const notifier = new TelegramNotifier();
    this.repo = new FileRepository(Post.with);

    this.search = new SearchPostUseCase(
      new LinkedInPostListFetcher(queryId),
      this.repo
    );

    this.evaluate = new EvaluateContentByCriteriaUseCase<Post>(
      evaluator,
      this.repo
    );
    this.notify = new NotifyRelevantOpportunitiesUseCase(notifier);
  }

  async execute(config: LinkedInSearchConfig) {
    this.repo.setFileName(config.query);

    const posts = await this.search.execute({
      query: config.query,
      filters: config.filters,
    });
    const scored = await this.evaluate.execute({
      items: posts,
      criterias: config.criterias,
      extractContent: (post) => post.content,
    });
    await this.notify.execute({
      items: scored,
      minScoreToNotify: config.minScoreToNotify,
    });
  }
}
