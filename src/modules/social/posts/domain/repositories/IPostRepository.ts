import { Id } from "@/shared/domain/value-objects/Id";
import { Post } from "../entities/Post";

export interface IPostRepository {
  save(post: Post): Promise<Post>;
  update(post: Post): Promise<void>;
  findPostsByAuthorId(authorId: Id<"UserId">): Promise<Post[]>;
  findPostById(postId: Id<"PostId">): Promise<Post | null>;
  findLikedPostsByUserId(userId: Id<"UserId">): Promise<Post[]>;
}
