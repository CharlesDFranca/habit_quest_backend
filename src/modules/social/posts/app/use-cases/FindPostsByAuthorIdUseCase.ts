import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { Id } from "@/shared/domain/value-objects/Id";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { UserNotFoundException } from "@/modules/users/app/errors/UserNotFoundException";
import { PostDetailsDto } from "../dtos/PostDetailsDto";
import { PostMapper } from "../mappers/PostMapper";

type FindPostsByAuthorIdInput = { authorId: string };
type FindPostsByAuthorIdOutput = PostDetailsDto[];

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
      throw new UserNotFoundException(
        `Author not found by id: ${authorId.value}`,
      );
    }

    const posts = await this.postRepository.findPostsByAuthorId(authorId);

    return posts.map((post) => PostMapper.toDetails(post));
  }
}
