import { JobSummaryDto } from "../dto/job-summary.dto";

export type JobFilters = Record<string, any>;
export type JobListFetcherResponse = {
  rawJobs: JobSummaryDto[];
  hasNextPage: boolean;
};

export interface JobListFetcher {
  fetch(
    query: string,
    filters: JobFilters,
    page: number,
    itemsPerPage: number
  ): Promise<JobListFetcherResponse>;
}
