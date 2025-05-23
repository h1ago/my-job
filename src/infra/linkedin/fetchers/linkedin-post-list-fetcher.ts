import { axiosInstance } from "@/infra/http/axios-instance";
import { Fetcher } from "./fetcher.contract";
import {
  PostListFetcher,
  PostListFetcherResponse,
} from "@/application/contracts/post-list-fetcher";
import { LinkedinPostFilters } from "@/config/types/LinkedInPost";
import { LinkedInPostListResponse } from "../types/post-list-response";
import { PostDto } from "@/application/dto/post.dto";
import { logger } from "@/utils/logger";

export class LinkedInPostListFetcher implements Fetcher, PostListFetcher {
  private queryId: string;

  constructor(queryId: string) {
    this.queryId = queryId;
    logger.info(`Fetcher de posts do LinkedIn inicializado.`);
  }

  public async fetch(
    query: string,
    filters: LinkedinPostFilters,
    page: number,
    itemsPerPage: number
  ): Promise<PostListFetcherResponse> {
    logger.info(
      `Buscando posts para a consulta: "${query}" (página ${page + 1})`
    );

    const start = page * itemsPerPage;

    const url = this._buildUrl(query, filters, start, itemsPerPage);

    const response = await axiosInstance
      .get<LinkedInPostListResponse>(url)
      .then(({ data }) => data)
      .catch(() => {
        throw new Error("Error fetching post list");
      });

    return this._presentOutput(response);
  }

  _buildUrl(
    query: string,
    filters: LinkedinPostFilters,
    start: number,
    count: number
  ): string {
    const encodedKeywords = encodeURIComponent(query)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
    const queryParams = [
      `(key:datePosted,value:List(${filters.dateRange}))`,
      `(key:resultType,value:List(CONTENT))`,
      `(key:sortBy,value:List(${filters.sortBy}))`,
    ];

    const variables = `(start:${start},origin:FACETED_SEARCH,query:(keywords:${encodedKeywords},flagshipSearchIntent:SEARCH_SRP,queryParameters:List(${queryParams.join(
      ","
    )})),count:${count})`;

    return `https://www.linkedin.com/voyager/api/graphql?variables=${variables}&queryId=${this.queryId}`;
  }

  _presentOutput(response: LinkedInPostListResponse): PostListFetcherResponse {
    logger.info("Processando resposta da API do LinkedIn...");

    const elements = response.data.searchDashClustersByAll.elements;
    const postCluster = elements.length > 1 ? elements[1] : elements[0];

    const rawPosts: PostDto[] = postCluster.items
      .filter(({ item }) => !!item.entityResult) // Garantir que entityResult exista
      .map(({ item }) => {
        const {
          trackingUrn,
          summary,
          navigationUrl,
          title,
          secondarySubtitle,
        } = item.entityResult!;
        return {
          postId: trackingUrn,
          author: title.text,
          link: navigationUrl,
          content: summary.text,
          postedDate: secondarySubtitle?.text || "",
        };
      });

    logger.info(`Encontrados ${postCluster.items.length} itens na resposta`);

    const { count, start, total } =
      response.data.searchDashClustersByAll.paging;
    const hasNextPage = start + count < total;

    return { rawPosts, hasNextPage };
  }
}
