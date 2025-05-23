import { NotifiableItemDto } from "@/domain/dto/notifiable-item.dto";
import { Post } from "@/domain/post/entity/post.entity";

export function mapPostToNotifiableItemDto(post: Post): NotifiableItemDto {
  return {
    type: "post",
    author: post.author,
    content: post.content,
    score: post.score,
    link: post.link,
  };
}
