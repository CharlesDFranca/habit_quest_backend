import { Id } from "@/shared/domain/value-objects/Id";
import { PostLike } from "../entities/PostLike";
import { CommentLike } from "../entities/CommentLike";

export interface ILikeRepository {
  findLikeByUserIdAndPostId(
    userId: Id<"UserId">,
    postId: Id<"PostId">,
  ): Promise<PostLike | null>;
  findLikeByUserIdAndCommentId(
    userId: Id<"UserId">,
    commentId: Id<"CommentId">,
  ): Promise<CommentLike | null>;
}
