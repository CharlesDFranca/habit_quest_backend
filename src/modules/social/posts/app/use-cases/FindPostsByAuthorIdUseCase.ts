import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { Post } from "../../domain/entities/Post";
import { Id } from "@/shared/domain/value-objects/Id";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";

type FindPostsByAuthorIdInput = { authorId: string };
type FindPostsByAuthorIdOutput = Post[];

@injectable()
export class FindPostsByAuthorIdUseCase
  implements IUseCase<FindPostsByAuthorIdInput, FindPostsByAuthorIdOutput>
{
  constructor(
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: FindPostsByAuthorIdInput,
  ): Promise<FindPostsByAuthorIdOutput> {
    const authorId = Id.create<"UserId">({ value: input.authorId });

    const authorExists = await this.userRepository.findUserById(authorId);

    if (!authorExists) {
      throw new Error("Author not found");
    }

    return this.postRepository.findPostsByAuthorId(authorId);
  }
}
