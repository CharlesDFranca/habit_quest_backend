import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { Id } from "@/shared/domain/value-objects/Id";
import { Post } from "../../domain/entities/Post";
import { UserNotFoundException } from "@/modules/users/app/errors/UserNotFoundException";

type FindLikedPostsByUserIdInput = { userId: string };
type FindLikedPostsByUserIdOutput = Post[];

@injectable()
export class FindLikedPostsByUserIdUseCase
  implements IUseCase<FindLikedPostsByUserIdInput, FindLikedPostsByUserIdOutput>
{
  constructor(
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: FindLikedPostsByUserIdInput,
  ): Promise<FindLikedPostsByUserIdOutput> {
    const userId = Id.create<"UserId">({ value: input.userId });

    const userExists = !!(await this.userRepository.findUserById(userId));

    if (!userExists) {
      throw new UserNotFoundException(`User not found by id: ${userId.value}`);
    }

    const likedPosts = await this.postRepository.findLikedPostsByUserId(userId);

    return likedPosts;
  }
}
