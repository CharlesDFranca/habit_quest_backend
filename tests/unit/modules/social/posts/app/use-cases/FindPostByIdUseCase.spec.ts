import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { FindPostByIdUseCase } from "@/modules/social/posts/app/use-cases/FindPostByIdUseCase";
import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { Id } from "@/shared/domain/value-objects/Id";
import { PostContent } from "@/modules/social/posts/domain/value-objects/PostContent";
import { Counter } from "@/shared/domain/value-objects/Counter";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { randomUUID } from "node:crypto";

describe("FindPostByIdUseCase", () => {
  let postRepository: IPostRepository;
  let useCase: FindPostByIdUseCase;

  const postId = Id.create<"PostId">({ value: randomUUID() });
  const authorId = Id.create<"UserId">({ value: randomUUID() });
  const createdAt = new Date("2023-01-01T00:00:00Z");
  const updatedAt = new Date("2023-01-02T00:00:00Z");

  const mockPost = Post.create(
    {
      authorId,
      content: PostContent.create({ value: "This is a post" }),
      images: [
        ImageUrl.create({ value: "image1.jpg" }),
        ImageUrl.create({ value: "image2.png" }),
      ],
      commentCount: Counter.create({ value: 3 }),
      likeCount: Counter.create({ value: 10 }),
      isPrivate: false,
      isPinned: false,
      createdAt,
      updatedAt,
    },
    postId,
  );

  beforeEach(() => {
    postRepository = {
      findPostById: vi.fn().mockResolvedValue(mockPost),
    } as unknown as IPostRepository;

    useCase = new FindPostByIdUseCase(postRepository);
  });

  it("should return post data when post is found", async () => {
    const output = await useCase.execute({ postId: postId.value });

    expect(output).toEqual({
      postId: postId.value,
      authorId: authorId.value,
      content: "This is a post",
      commentCount: 3,
      likeCount: 10,
      images: ["image1.jpg", "image2.png"],
      createdAt,
      updatedAt,
    });

    expect(postRepository.findPostById).toHaveBeenCalledOnce();
    expect(postRepository.findPostById).toHaveBeenCalledWith(postId);
  });

  it("should throw an error if post is not found", async () => {
    (postRepository.findPostById as Mock).mockResolvedValue(null);

    await expect(() =>
      useCase.execute({ postId: randomUUID() }),
    ).rejects.toThrow("Post not found");
  });
});
