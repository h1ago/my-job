/**
 * @fileoverview Configurações de busca para o LinkedIn, incluindo busca de vagas e publicaçẽs
 */

import { LinkedinJobFilters } from "./LinkedInJob";
import { LinkedinPostFilters } from "./LinkedInPost";

export type SearchType = "job" | "post";

/**
 * Interface que define os critérios de análise do texto para uma vaga ou publicação
 * @interface Criteria
 * @property {string} keyword - Palavra-chave para buscar no conteúdo
 * @property {number} weight - Peso do critério na pontuação final do score
 */
export interface Criteria {
  keyword: string;
  weight: number;
}

/**
 * Configuração base para buscas de vagas e publicações no LinkedIn
 * @interface BaseSearchConfig
 * @property {string} query - Consulta principal de busca
 * @property {Criteria[]} criterias - Lista de critérios para pontuação
 * @property {number} minScoreToNotify - Pontuação mínima para notificação
 */
interface BaseSearchConfig {
  query: string;
  criterias: Criteria[];
  minScoreToNotify: number;
}

export interface JobSearchConfig extends BaseSearchConfig {
  searchType: "job";
  filters: LinkedinJobFilters;
}

export interface PostSearchConfig extends BaseSearchConfig {
  searchType: "post";
  filters: LinkedinPostFilters;
}

export type LinkedInSearchConfig = JobSearchConfig | PostSearchConfig;
