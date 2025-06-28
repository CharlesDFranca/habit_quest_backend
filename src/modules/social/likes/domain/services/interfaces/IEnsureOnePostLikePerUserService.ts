import { Id } from "@/shared/domain/value-objects/Id";

export interface IEnsureOnePostLikePerUserService {
  assertUserHasNotLikedPost(
    userId: Id<"UserId">,
    postId: Id<"PostId">,
  ): Promise<void>;
}
