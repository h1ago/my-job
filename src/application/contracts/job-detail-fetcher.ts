import { JobDetailDto } from "../dto/job-detail.dto";

export interface JobDetailFetcher {
  fetch(url: string): Promise<JobDetailDto | null>;
}
