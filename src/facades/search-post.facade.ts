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
  private search: SearchPostUseCase;
  private evaluate: EvaluateContentByCriteriaUseCase<Post>;
  private notify: NotifyRelevantOpportunitiesUseCase;

  constructor(queryId: string) {
    const repo = new FileRepository("posts-data.json", Post.with);
    const evaluator = new KeywordContentEvaluator();
    const notifier = new TelegramNotifier();

    this.search = new SearchPostUseCase(
      new LinkedInPostListFetcher(queryId),
      repo
    );

    this.evaluate = new EvaluateContentByCriteriaUseCase<Post>(evaluator, repo);
    this.notify = new NotifyRelevantOpportunitiesUseCase(notifier);
  }

  async execute(config: LinkedInSearchConfig) {
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
