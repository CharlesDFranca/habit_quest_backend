import "reflect-metadata";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { PostContent } from "@/modules/social/posts/domain/value-objects/PostContent";
import { Counter } from "@/shared/domain/value-objects/Counter";
import { Id } from "@/shared/domain/value-objects/Id";
import { randomUUID } from "crypto";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { IPostLikeRepository } from "@/modules/social/likes/domain/repositories/IPostLikeRepository";
import { LikeAPostUseCase } from "@/modules/social/likes/app/use-cases/post-like/LikeAPostUseCase";

describe("LikeAPostUseCase", () => {
  let postLikeRepo: IPostLikeRepository;
  let userRepo: IUserRepository;
  let postRepo: IPostRepository;
  let useCase: LikeAPostUseCase;

  const userId = Id.create<"UserId">({ value: randomUUID() });
  const postId = Id.create<"PostId">({ value: randomUUID() });

  const mockPost = Post.create(
    {
      authorId: userId,
      content: PostContent.create({ value: "Sample content" }),
      images: [ImageUrl.create({ value: "image.jpg" })],
      commentCount: Counter.create({ value: 0 }),
      likeCount: Counter.create({ value: 0 }),
      isPrivate: false,
      isPinned: false,
    },
    postId,
  );

  beforeEach(() => {
    postLikeRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findLikeByUserIdAndPostId: vi.fn().mockResolvedValue(null),
    } as unknown as IPostLikeRepository;

    userRepo = {
      findUserById: vi.fn().mockResolvedValue({ id: userId }),
    } as unknown as IUserRepository;

    postRepo = {
      findPostById: vi.fn().mockResolvedValue(mockPost),
      update: vi.fn().mockResolvedValue(undefined),
    } as unknown as IPostRepository;

    useCase = new LikeAPostUseCase(postLikeRepo, userRepo, postRepo);
  });

  it("should like a post successfully", async () => {
    const output = await useCase.execute({
      userId: userId.value,
      postId: postId.value,
    });

    expect(output).toHaveProperty("postLikeId");
    expect(postLikeRepo.save).toHaveBeenCalledOnce();
    expect(postRepo.update).toHaveBeenCalledOnce();
    expect(mockPost.likeCount.value).toBe(1);
  });

  it("should throw if user does not exist", async () => {
    (userRepo.findUserById as Mock).mockResolvedValue(null);

    await expect(() =>
      useCase.execute({ userId: userId.value, postId: postId.value }),
    ).rejects.toThrow("User not found");
  });

  it("should throw if post does not exist", async () => {
    (postRepo.findPostById as Mock).mockResolvedValue(null);

    await expect(() =>
      useCase.execute({ userId: userId.value, postId: postId.value }),
    ).rejects.toThrow("Post not found");
  });

  it("should throw if post already liked by the user", async () => {
    (postLikeRepo.findLikeByUserIdAndPostId as Mock).mockResolvedValue({
      id: Id.create<"LikeId">({ value: randomUUID() }),
    });

    await expect(() =>
      useCase.execute({ userId: userId.value, postId: postId.value }),
    ).rejects.toThrow("Post already liked!");
  });
});
