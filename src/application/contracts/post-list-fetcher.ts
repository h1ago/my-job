import { PostDto } from "../dto/post.dto";

export type PostFilters = Record<string, any>;
export type PostListFetcherResponse = {
  rawPosts: PostDto[];
  hasNextPage: boolean;
};

export interface PostListFetcher {
  fetch(
    query: string,
    filters: PostFilters,
    page: number,
    itemsPerPage: number
  ): Promise<PostListFetcherResponse>;
}
