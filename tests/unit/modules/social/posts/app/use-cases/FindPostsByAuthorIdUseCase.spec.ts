import "reflect-metadata";

import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { FindPostsByAuthorIdUseCase } from "@/modules/social/posts/app/use-cases/FindPostsByAuthorIdUseCase";
import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { Id } from "@/shared/domain/value-objects/Id";
import { randomUUID } from "crypto";
import { FakeUserFactory } from "tests/helpers/mocks/users/fakes/FakeUserFactory";
import { PostContent } from "@/modules/social/posts/domain/value-objects/PostContent";
import { Counter } from "@/shared/domain/value-objects/Counter";

describe("FindPostsByAuthorIdUseCase", () => {
  let postRepository: IPostRepository;
  let userRepository: IUserRepository;
  let useCase: FindPostsByAuthorIdUseCase;

  const userId = Id.create<"UserId">({ value: randomUUID() });

  beforeEach(() => {
    postRepository = {
      findPostsByAuthorId: vi.fn(),
    } as unknown as IPostRepository;

    userRepository = {
      findUserById: vi.fn().mockResolvedValue(
        FakeUserFactory.createUser(
          {
            alias: "user_alias",
            email: "user@domain.com",
            name: "user",
            password: "StrongPass123!",
          },
          userId,
        ),
      ),
    } as unknown as IUserRepository;

    useCase = new FindPostsByAuthorIdUseCase(postRepository, userRepository);
  });

  it("should return all posts from an existing author", async () => {
    const mockPosts = [
      Post.create({
        authorId: userId,
        content: PostContent.create({ value: "Post 1" }),
        images: [],
        commentCount: Counter.create({ value: 0 }),
        likeCount: Counter.create({ value: 0 }),
        isPrivate: false,
        isPinned: false,
      }),
      Post.create({
        authorId: userId,
        content: PostContent.create({ value: "Post 2" }),
        images: [],
        commentCount: Counter.create({ value: 2 }),
        likeCount: Counter.create({ value: 5 }),
        isPrivate: false,
        isPinned: true,
      }),
    ];

    (postRepository.findPostsByAuthorId as Mock).mockResolvedValue(mockPosts);

    const output = await useCase.execute({ authorId: userId.value });

    expect(output).toHaveLength(2);
    expect(output[0].content.value).toBe("Post 1");
    expect(output[1].isPinned).toBe(true);
  });

  it("should return an empty array if author has no posts", async () => {
    (postRepository.findPostsByAuthorId as Mock).mockResolvedValue([]);

    const output = await useCase.execute({ authorId: userId.value });

    expect(output).toEqual([]);
  });

  it("should throw if author does not exist", async () => {
    (userRepository.findUserById as Mock).mockResolvedValue(null);

    await expect(useCase.execute({ authorId: randomUUID() })).rejects.toThrow(
      "Author not found",
    );
  });
});
