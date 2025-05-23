import { Criteria } from "@/config/types/LinkedInSearchConfig";
import { ContentEvaluator } from "./content-evaluator";

export class KeywordContentEvaluator implements ContentEvaluator {
  evaluate(content: string, criterias: Criteria[]): number {
    let totalWeight = 0;
    let matchedWeight = 0;

    for (const criteria of criterias) {
      totalWeight += criteria.weight;

      const keywordLower = criteria.keyword.toLowerCase();
      const textLower = content.toLowerCase();

      if (textLower.includes(keywordLower)) {
        matchedWeight += criteria.weight;
      }
    }

    if (totalWeight === 0) return 0;
    const score = (matchedWeight / totalWeight) * 100;
    return Math.round(score);
  }
}
