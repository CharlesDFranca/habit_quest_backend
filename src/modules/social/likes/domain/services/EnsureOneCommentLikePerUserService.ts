import { Id } from "@/shared/domain/value-objects/Id";
import { IEnsureOneCommentLikePerUserService } from "./interfaces/IEnsureOneCommentLikePerUserService";
import { ILikeRepository } from "../repositories/ILikeRepository";

export class EnsureOneCommentLikePerUserService
  implements IEnsureOneCommentLikePerUserService
{
  constructor(private readonly likeRepository: ILikeRepository) {}

  async assertUserHasNotLikedComment(
    userId: Id<"UserId">,
    commentId: Id<"CommentId">,
  ): Promise<void> {
    const alreadyLiked = await this.likeRepository.findLikeByUserIdAndCommentId(
      userId,
      commentId,
    );

    if (alreadyLiked) {
      throw new Error("User cannot like a comment more than once");
    }
  }
}
