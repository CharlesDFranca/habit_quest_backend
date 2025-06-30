import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { Id } from "@/shared/domain/value-objects/Id";
import { PostContent } from "../../domain/value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { Post } from "../../domain/entities/Post";
import { Counter } from "@/shared/domain/value-objects/Counter";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { inject, injectable } from "tsyringe";

type CreatePostInput = {
  authorId: string;
  content: string;
  isPrivate?: boolean;
  imagesUrls: string[];
};

type CreatePostOutput = { postId: Id<"PostId"> };

@injectable()
export class CreatePostUseCase
  implements IUseCase<CreatePostInput, CreatePostOutput>
{
  constructor(
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(input: CreatePostInput): Promise<CreatePostOutput> {
    const authorId = Id.create<"UserId">({ value: input.authorId });
    const content = PostContent.create({ value: input.content });
    const imageUrls = input.imagesUrls.map((imageUrl) =>
      ImageUrl.create({ value: imageUrl }),
    );

    const post = Post.create({
      authorId,
      content,
      images: imageUrls,
      commentCount: Counter.create({ value: 0 }),
      likeCount: Counter.create({ value: 0 }),
      isPrivate: input.isPrivate ?? false,
      isPinned: false,
    });

    await this.postRepository.save(post);

    return { postId: post.id };
  }
}
