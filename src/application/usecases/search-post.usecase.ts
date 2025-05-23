import { Post } from "@/domain/post/entity/post.entity";
import { UseCase } from "./usecase.contract";
import { PostRepository } from "@/domain/post/repository/post.repository";
import { PostListFetcher } from "../contracts/post-list-fetcher";
import { defaultConfig } from "@/config/bot.config";

interface SearchPostInput {
  query: string;
  filters: Record<string, any>;
}

type SearchPostOutput = Post[];

export class SearchPostUseCase
  implements UseCase<SearchPostInput, SearchPostOutput>
{
  constructor(
    private readonly listFetcher: PostListFetcher,
    private readonly postRepository: PostRepository
  ) {}

  async execute(input: SearchPostInput): Promise<SearchPostOutput> {
    let page = 0;
    let hasNextPage = true;
    const perPage = defaultConfig.post.pageSize;
    const newPosts: Post[] = [];

    while (hasNextPage) {
      const { rawPosts, hasNextPage: next } = await this.listFetcher.fetch(
        input.query,
        input.filters,
        page,
        perPage
      );
      hasNextPage = next;
      page++;

      for (const rawPost of rawPosts) {
        const postAlreadExists = await this.postRepository.findOne(
          rawPost.postId
        );

        if (postAlreadExists) break;

        const post = Post.create(
          rawPost.postId,
          rawPost.author,
          rawPost.content,
          rawPost.link,
          rawPost.postedDate
        );

        newPosts.push(post);
        await this.postRepository.save(post);
      }
    }

    return newPosts;
  }
}
