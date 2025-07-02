import { Id } from "@/shared/domain/value-objects/Id";
import { CommentLike } from "../entities/CommentLike";

export interface ICommentLikeRepository {
  save(commentLike: CommentLike): Promise<CommentLike>;
  findLikeByUserIdAndCommentId(
    userId: Id<"UserId">,
    commentId: Id<"CommentId">,
  ): Promise<CommentLike | null>;
}
