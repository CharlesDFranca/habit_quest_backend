import "reflect-metadata";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { FindLikedPostsByUserIdUseCase } from "@/modules/social/posts/app/use-cases/FindLikedPostsByUserIdUseCase";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { Id } from "@/shared/domain/value-objects/Id";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { PostContent } from "@/modules/social/posts/domain/value-objects/PostContent";
import { Counter } from "@/shared/domain/value-objects/Counter";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { randomUUID } from "node:crypto";

describe("FindLikedPostsByUserIdUseCase", () => {
  let userRepo: IUserRepository;
  let postRepo: IPostRepository;
  let useCase: FindLikedPostsByUserIdUseCase;

  const userId = Id.create<"UserId">({ value: randomUUID() });

  const mockPosts: Post[] = [
    Post.create({
      authorId: userId,
      content: PostContent.create({ value: "Liked post 1" }),
      images: [ImageUrl.create({ value: "image1.jpg" })],
      commentCount: Counter.create({ value: 1 }),
      likeCount: Counter.create({ value: 5 }),
      isPrivate: false,
      isPinned: false,
    }),
    Post.create({
      authorId: userId,
      content: PostContent.create({ value: "Liked post 2" }),
      images: [],
      commentCount: Counter.create({ value: 0 }),
      likeCount: Counter.create({ value: 2 }),
      isPrivate: false,
      isPinned: false,
    }),
  ];

  beforeEach(() => {
    userRepo = {
      findUserById: vi.fn().mockResolvedValue({ id: userId }),
    } as unknown as IUserRepository;

    postRepo = {
      findLikedPostsByUserId: vi.fn().mockResolvedValue(mockPosts),
    } as unknown as IPostRepository;

    useCase = new FindLikedPostsByUserIdUseCase(postRepo, userRepo);
  });

  it("should return liked posts for a valid user", async () => {
    const result = await useCase.execute({ userId: userId.value });

    expect(result).toEqual(mockPosts);
    expect(userRepo.findUserById).toHaveBeenCalledOnce();
    expect(postRepo.findLikedPostsByUserId).toHaveBeenCalledOnce();
    expect(postRepo.findLikedPostsByUserId).toHaveBeenCalledWith(userId);
  });

  it("should throw an error if user does not exist", async () => {
    (userRepo.findUserById as Mock).mockResolvedValue(null);

    await expect(() =>
      useCase.execute({ userId: userId.value }),
    ).rejects.toThrow("User not found");

    expect(userRepo.findUserById).toHaveBeenCalledOnce();
    expect(postRepo.findLikedPostsByUserId).not.toHaveBeenCalled();
  });
});
