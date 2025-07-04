import { Id } from "@/shared/domain/value-objects/Id";
import { IEnsureOneCommentLikePerUserService } from "./interfaces/IEnsureOneCommentLikePerUserService";
import { ICommentLikeRepository } from "../repositories/ICommentLikeRepository";
import { UserAlreadyLikedCommentException } from "../errors/UserAlreadyLikedCommentException";

export class EnsureOneCommentLikePerUserService
  implements IEnsureOneCommentLikePerUserService
{
  constructor(private readonly commentLikeRepository: ICommentLikeRepository) {}

  async assertUserHasNotLikedComment(
    userId: Id<"UserId">,
    commentId: Id<"CommentId">,
  ): Promise<void> {
    const alreadyLiked =
      await this.commentLikeRepository.findLikeByUserIdAndCommentId(
        userId,
        commentId,
      );

    if (alreadyLiked) {
      throw new UserAlreadyLikedCommentException(
        "User cannot like a comment more than once",
      );
    }
  }
}
