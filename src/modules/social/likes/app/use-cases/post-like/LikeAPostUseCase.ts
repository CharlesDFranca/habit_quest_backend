import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { Id } from "@/shared/domain/value-objects/Id";
import { inject, injectable } from "tsyringe";
import { IPostLikeRepository } from "../../../domain/repositories/IPostLikeRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { PostLike } from "../../../domain/entities/PostLike";

type LikeAPostInput = { userId: string; postId: string };
type LikeAPostOutput = { postLikeId: Id<"LikeId"> };

@injectable()
export class LikeAPostUseCase
  implements IUseCase<LikeAPostInput, LikeAPostOutput>
{
  constructor(
    @inject("PostLikeRepository")
    private readonly postLikeRepository: IPostLikeRepository,
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(input: LikeAPostInput): Promise<LikeAPostOutput> {
    const userId = Id.create<"UserId">({ value: input.userId });
    const postId = Id.create<"PostId">({ value: input.postId });

    const userExists = await this.userRepository.findUserById(userId);

    if (!userExists) {
      throw new Error("User not found");
    }

    const postExists = await this.postRepository.findPostById(postId);

    if (!postExists) {
      throw new Error("Post not found");
    }

    const alreadyLiked =
      !!(await this.postLikeRepository.findLikeByUserIdAndPostId(
        userId,
        postId,
      ));

    if (alreadyLiked) {
      throw new Error("Post already liked!");
    }

    const postLike = PostLike.create({ postId, userId });

    await this.postLikeRepository.save(postLike);

    postExists.increaseLikeCount();

    console.log(postExists["props"].likeCount);

    await this.postRepository.update(postExists);

    return { postLikeId: postLike.id };
  }
}
