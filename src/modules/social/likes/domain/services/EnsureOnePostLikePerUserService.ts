import { Id } from "@/shared/domain/value-objects/Id";
import { IEnsureOnePostLikePerUserService } from "./interfaces/IEnsureOnePostLikePerUserService";
import { IPostLikeRepository } from "../repositories/IPostLikeRepository";
import { UserAlreadyLikedPostException } from "../errors/UserAlreadyLikedPostException";

export class EnsureOnePostLikePerUserService
  implements IEnsureOnePostLikePerUserService
{
  constructor(private readonly postLikeRepository: IPostLikeRepository) {}

  async assertUserHasNotLikedPost(
    userId: Id<"UserId">,
    postId: Id<"PostId">,
  ): Promise<void> {
    const alreadyLiked =
      await this.postLikeRepository.findLikeByUserIdAndPostId(userId, postId);

    if (alreadyLiked) {
      throw new UserAlreadyLikedPostException(
        "User cannot like a post more than once",
      );
    }
  }
}
