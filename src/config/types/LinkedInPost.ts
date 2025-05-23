// Intervalos de tempo para publicações
type PostDateRange = "any" | "past-24h" | "past-week" | "past-month";

// Ordenação de resultados
type PostSortBy = "relevance" | "date_posted"; // 'relevance' é o default quando não está explícito

export interface LinkedinPostFilters {
  dateRange: PostDateRange;
  sortBy: PostSortBy;
}
