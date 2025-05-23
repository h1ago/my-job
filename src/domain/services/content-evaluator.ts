import { Criteria } from "@/config/types/LinkedInSearchConfig";

export interface ContentEvaluator {
  evaluate(content: string, criterias: Criteria[]): number;
}
