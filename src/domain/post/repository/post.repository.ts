import { GenericRepository } from "@/domain/shared/repositories/generic-repository";
import { Post } from "../entity/post.entity";

export interface PostRepository extends GenericRepository<Post> {}
