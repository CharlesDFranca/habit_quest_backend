import { Id } from "@/shared/domain/value-objects/Id";
import { PostLike } from "../entities/PostLike";

export interface IPostLikeRepository {
  save(postLike: PostLike): Promise<PostLike>;
  findLikeByUserIdAndPostId(
    userId: Id<"UserId">,
    postId: Id<"PostId">,
  ): Promise<PostLike | null>;
}
