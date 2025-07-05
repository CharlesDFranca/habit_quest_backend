import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { Id } from "@/shared/domain/value-objects/Id";
import { PostContent } from "../../domain/value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { Post } from "../../domain/entities/Post";
import { Counter } from "@/shared/domain/value-objects/Counter";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import {
  ImageInput,
  IImageStorageService,
} from "@/shared/app/interfaces/IImageStorageService";
import { UserNotFoundException } from "@/modules/users/app/errors/UserNotFoundException";
import { PostMapper } from "../mappers/PostMapper";
import { PostIdDto } from "../dtos/PostIdDto";

type CreatePostInput = {
  authorId: string;
  content: string;
  isPrivate?: boolean;
  imagesUrls: ImageInput[];
};

type CreatePostOutput = PostIdDto;

@injectable()
export class CreatePostUseCase
  implements IUseCase<CreatePostInput, CreatePostOutput>
{
  private readonly uploadedPaths: string[] = [];

  constructor(
    @inject("PostRepository")
    private readonly postRepository: IPostRepository,
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("ImageStorageService")
    private readonly storageImageService: IImageStorageService,
  ) {}

  async execute(input: CreatePostInput): Promise<CreatePostOutput> {
    const authorId = Id.create<"UserId">({ value: input.authorId });

    const authorExists = await this.userRepository.findUserById(authorId);

    if (!authorExists) {
      throw new UserNotFoundException(
        `Author not found by id: ${authorId.value}`,
      );
    }

    const content = PostContent.create({ value: input.content });

    const imageUrls = await Promise.all(
      input.imagesUrls.map(async (file) => {
        const path = await this.storageImageService.save(file);
        this.uploadedPaths.push(path);
        return ImageUrl.create({ value: path });
      }),
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

    return PostMapper.toId(post);
  }

  async rollback(): Promise<void> {
    await Promise.all(
      this.uploadedPaths.map((path) => this.storageImageService.delete(path)),
    );
  }
}
