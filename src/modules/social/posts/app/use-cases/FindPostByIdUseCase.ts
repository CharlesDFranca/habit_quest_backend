import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { Id } from "@/shared/domain/value-objects/Id";

type FindPostByIdInput = { postId: string };
type FindPostByIdOutput = {
  postId: string;
  authorId: string;
  content: string;
  images: string[];
  commentCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export class FindPostByIdUseCase
  implements IUseCase<FindPostByIdInput, FindPostByIdOutput>
{
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(input: FindPostByIdInput): Promise<FindPostByIdOutput> {
    const postId = Id.create<"PostId">({ value: input.postId });

    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    return {
      postId: post.id.value,
      authorId: post.authorId.value,
      content: post.content.value,
      commentCount: post.commentCount.value,
      likeCount: post.likeCount.value,
      images: post.images.map((image) => image.value),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
