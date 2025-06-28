import { Id } from "@/shared/domain/value-objects/Id";

export interface IEnsureOneCommentLikePerUserService {
  assertUserHasNotLikedComment(
    userId: Id<"UserId">,
    commentId: Id<"CommentId">,
  ): Promise<void>;
}
