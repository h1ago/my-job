import { GenericRepository } from "@/domain/shared/repositories/generic-repository";
import { Criteria } from "@/config/types/LinkedInSearchConfig";
import { ContentEvaluator } from "@/domain/services/content-evaluator";
import { UseCase } from "./usecase.contract";

interface EvaluateInput<T> {
  items: T[];
  criterias: Criteria[];
  extractContent: (item: T) => string;
}

type EvaluateOutput<T> = T[];

export class EvaluateContentByCriteriaUseCase<
  T extends { setScore: (score: number) => void }
> implements UseCase<EvaluateInput<T>, EvaluateOutput<T>>
{
  constructor(
    private readonly evaluator: ContentEvaluator,
    private readonly repository: GenericRepository<T>
  ) {}

  async execute(input: EvaluateInput<T>): Promise<EvaluateOutput<T>> {
    const { items, criterias, extractContent } = input;

    for (const item of items) {
      const content = extractContent(item);
      const score = this.evaluator.evaluate(content, criterias);
      item.setScore(score);
      await this.repository.update(item);
    }

    return items;
  }
}
