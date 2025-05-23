import { axiosInstance } from "@/infra/http/axios-instance";
import { LinkedInJobDetailResponse } from "../types/job-detail-response";
import { JobDetailFetcher } from "@/application/contracts/job-detail-fetcher";
import { JobDetailDto } from "@/application/dto/job-detail.dto";
import { Fetcher } from "./fetcher.contract";

export class LinkedInJobDetailtFetcher implements Fetcher, JobDetailFetcher {
  private queryId: string;

  constructor(queryId: string) {
    this.queryId = queryId;
  }

  public async fetch(jobId: string): Promise<JobDetailDto | null> {
    const url = this._buildUrl(jobId);

    const response = await axiosInstance
      .get<LinkedInJobDetailResponse | null>(url)
      .then(({ data }) => data)
      .catch(() => null);

    return this._presentOutput(response);
  }

  _buildUrl(jobPostingUrn: string): string {
    const encodedUrn = encodeURIComponent(jobPostingUrn);

    const url = `https://www.linkedin.com/voyager/api/graphql?variables=(cardSectionTypes:List(JOB_DESCRIPTION_CARD),jobPostingUrn:${encodedUrn},includeSecondaryActionsV2:true)&queryId=${this.queryId}`;

    return url;
  }

  _presentOutput(
    response: LinkedInJobDetailResponse | null
  ): JobDetailDto | null {
    if (!response) return null;

    const element =
      response.data.jobsDashJobPostingDetailSectionsByCardSectionTypes
        .elements[0];

    const jobSection = element?.jobPostingDetailSection[0];

    const jobDescription =
      jobSection.jobDescription?.descriptionText.text ||
      jobSection.jobDescription?.jobPosting.description.text;

    if (!jobDescription) return null;

    return {
      content: jobDescription,
      postedDate: jobSection.jobDescription?.postedOnText || "",
    };
  }
}
