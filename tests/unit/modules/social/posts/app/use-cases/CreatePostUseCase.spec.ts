import "reflect-metadata";

import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { CreatePostUseCase } from "@/modules/social/posts/app/use-cases/CreatePostUseCase";
import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { randomUUID } from "node:crypto";

describe("CreatePostUseCase", () => {
  let postRepository: IPostRepository;
  let useCase: CreatePostUseCase;

  beforeEach(() => {
    postRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    } as unknown as IPostRepository;

    useCase = new CreatePostUseCase(postRepository);
  });

  it("should create a post with valid input", async () => {
    const input = {
      authorId: randomUUID(),
      content: "Hello world!",
      imagesUrls: ["image1.jpg", "folder/image2.png"],
    };

    const output = await useCase.execute(input);

    expect(output).toHaveProperty("postId");
    expect(postRepository.save).toHaveBeenCalledOnce();
  });

  it("should create a private post if isPrivate is true", async () => {
    const input = {
      authorId: randomUUID(),
      content: "Private post",
      imagesUrls: ["image.jpg"],
      isPrivate: true,
    };

    await useCase.execute(input);

    const postSaved = (postRepository.save as Mock).mock.calls[0][0] as Post;

    expect(postSaved.isPrivate).toBe(true);
  });

  it("should throw an error if content is empty", async () => {
    const input = {
      authorId: randomUUID(),
      content: "   ",
      imagesUrls: ["image.jpg"],
    };

    await expect(() => useCase.execute(input)).rejects.toThrow(
      "Post content cannot be empty",
    );
  });

  it("should throw an error if content exceeds max length", async () => {
    const input = {
      authorId: randomUUID(),
      content: "a".repeat(2501),
      imagesUrls: ["image.jpg"],
    };

    await expect(() => useCase.execute(input)).rejects.toThrow(
      "Post content cannot be too long",
    );
  });

  it("should throw an error if any image URL is empty", async () => {
    const input = {
      authorId: randomUUID(),
      content: "Post with invalid image",
      imagesUrls: ["   "],
    };

    await expect(() => useCase.execute(input)).rejects.toThrow(
      "Image url cannot be empty",
    );
  });

  it("should throw an error if image URL has invalid extension", async () => {
    const input = {
      authorId: randomUUID(),
      content: "Post with invalid image",
      imagesUrls: ["image.txt"],
    };

    await expect(() => useCase.execute(input)).rejects.toThrow(
      "Invalid image extension",
    );
  });

  it("should throw an error if image URL has no filename", async () => {
    const input = {
      authorId: randomUUID(),
      content: "Post with invalid image",
      imagesUrls: [".png"],
    };

    await expect(() => useCase.execute(input)).rejects.toThrow(
      "Image URL must contain a filename before the extension",
    );
  });
});
