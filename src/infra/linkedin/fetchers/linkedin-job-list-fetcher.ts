import { axiosInstance } from "@/infra/http/axios-instance";
import {
  ExperienceLevelMap,
  JobTypeMap,
  LinkedinJobFilters,
  TimePostedMap,
  WorkTypeMap,
} from "../../../config/types/LinkedInJob";
import { LinkedInJobListResponse } from "../types/job-list-response";
import {
  JobListFetcher,
  JobListFetcherResponse,
} from "@/application/contracts/job-list-fetcher";
import { Fetcher } from "./fetcher.contract";
import { logger } from "@/utils/logger";

export class LinkedInJobListFetcher implements Fetcher, JobListFetcher {
  private readonly BASE_URL =
    "https://www.linkedin.com/voyager/api/voyagerJobsDashJobCards";
  private readonly DECORATION_ID =
    "com.linkedin.voyager.dash.deco.jobs.search.JobSearchCardsCollection-219";

  public async fetch(
    query: string,
    filters: LinkedinJobFilters,
    page: number,
    itemsPerPage: number
  ): Promise<JobListFetcherResponse> {
    logger.info(
      `Buscando jobs para a consulta: "${query}" (página ${page + 1})`
    );

    const start = page * itemsPerPage;

    const url = this._buildUrl(query, filters, start, itemsPerPage);

    const response = await axiosInstance
      .get<LinkedInJobListResponse>(url)
      .then(({ data }) => data)
      .catch(() => {
        throw new Error("Error fetching job list");
      });

    return this._presentOutput(response);
  }

  _buildUrl(
    query: string,
    filters: LinkedinJobFilters,
    start: number,
    count: number
  ): string {
    const selectedFilters: string[] = [];

    if (filters.timePosted && filters.timePosted !== "any_time") {
      selectedFilters.push(
        `timePostedRange:List(${TimePostedMap[filters.timePosted]})`
      );
    }

    if (filters.workTypes?.length) {
      const values = filters.workTypes.map((t) => WorkTypeMap[t]).join(",");
      selectedFilters.push(`workplaceType:List(${values})`);
    }

    if (filters.jobTypes?.length) {
      const values = filters.jobTypes.map((t) => JobTypeMap[t]).join(",");
      selectedFilters.push(`jobType:List(${values})`);
    }

    if (filters.experienceLevels?.length) {
      const values = filters.experienceLevels
        .map((e) => ExperienceLevelMap[e])
        .join(",");
      selectedFilters.push(`experience:List(${values})`);
    }

    const url = `${this.BASE_URL}?decorationId=${
      this.DECORATION_ID
    }&count=${count}&q=jobSearch&query=(${[
      `origin:JOB_SEARCH_PAGE_JOB_FILTER`,
      `keywords:${encodeURIComponent(query)}`,
      selectedFilters.length > 0
        ? `selectedFilters:(${selectedFilters.join(",")})`
        : "",
      `spellCorrectionEnabled:true`,
    ]
      .filter(Boolean)
      .join(",")})&start=${start}`;

    return url;
  }

  _presentOutput(response: LinkedInJobListResponse): JobListFetcherResponse {
    logger.info("Processando resposta da API do LinkedIn...");

    const rawJobs = response.elements.map((el) => {
      const card = el.jobCardUnion.jobPostingCard;
      const externalJobId = card.jobPostingUrn.split(":").pop();
      const jobUrl = `https://www.linkedin.com/jobs/view/${externalJobId}`;

      return {
        jobId: card.jobPostingUrn,
        title: card.jobPostingTitle,
        company: card.primaryDescription.text,
        location: card.secondaryDescription?.text || "",
        url: jobUrl,
      };
    });

    logger.info(`Encontrados ${rawJobs.length} itens na resposta`);

    const { count, start, total } = response.paging;
    const hasNextPage = start + count < total;

    return { rawJobs, hasNextPage };
  }
}
