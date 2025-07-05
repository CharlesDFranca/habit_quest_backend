import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { Id } from "@/shared/domain/value-objects/Id";
import { inject, injectable } from "tsyringe";
import { PostNotFoundException } from "../errors/PostNotFoundException";
import { PostDetailsDto } from "../dtos/PostDetailsDto";
import { PostMapper } from "../mappers/PostMapper";

type FindPostByIdInput = { postId: string };
type FindPostByIdOutput = PostDetailsDto;

@injectable()
export class FindPostByIdUseCase
  implements IUseCase<FindPostByIdInput, FindPostByIdOutput>
{
  constructor(
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(input: FindPostByIdInput): Promise<FindPostByIdOutput> {
    const postId = Id.create<"PostId">({ value: input.postId });

    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new PostNotFoundException(`Post not found by id: ${postId.value}`);
    }

    return PostMapper.toDetails(post);
  }
}
