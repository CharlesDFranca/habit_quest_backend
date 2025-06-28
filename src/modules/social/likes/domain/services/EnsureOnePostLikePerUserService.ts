import { Id } from "@/shared/domain/value-objects/Id";
import { IEnsureOnePostLikePerUserService } from "./interfaces/IEnsureOnePostLikePerUserService";
import { ILikeRepository } from "../repositories/ILikeRepository";

export class EnsureOnePostLikePerUserService
  implements IEnsureOnePostLikePerUserService
{
  constructor(private readonly likeRepository: ILikeRepository) {}

  async assertUserHasNotLikedPost(
    userId: Id<"UserId">,
    postId: Id<"PostId">,
  ): Promise<void> {
    const alreadyLiked = await this.likeRepository.findLikeByUserIdAndPostId(
      userId,
      postId,
    );

    if (alreadyLiked) {
      throw new Error("User cannot like a post more than once");
    }
  }
}
