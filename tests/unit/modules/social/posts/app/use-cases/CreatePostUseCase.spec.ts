import "reflect-metadata";

import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { CreatePostUseCase } from "@/modules/social/posts/app/use-cases/CreatePostUseCase";
import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { User } from "@/modules/users/domain/entities/User";
import { Id } from "@/shared/domain/value-objects/Id";
import { randomUUID } from "node:crypto";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Password } from "@/modules/users/domain/value-objects/Password";

describe("CreatePostUseCase", () => {
  let postRepository: IPostRepository;
  let userRepository: IUserRepository;
  let useCase: CreatePostUseCase;

  beforeEach(() => {
    postRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    } as unknown as IPostRepository;

    userRepository = {
      findUserById: vi.fn().mockResolvedValue(
        User.create(
          {
            alias: Alias.create({ value: "user_alias" }),
            email: Email.create({ value: "example@domain.com" }),
            name: Name.create({ value: "user_name" }),
            password: Password.create({ value: "StrongPass123!" }),
          },
          Id.generate<"UserId">(),
        ),
      ),
    } as unknown as IUserRepository;

    useCase = new CreatePostUseCase(postRepository, userRepository);
  });

  it("should create a post with valid input", async () => {
    const input = {
      authorId: randomUUID(),
      content: "Hello world!",
      imagesUrls: ["image1.jpg", "folder/image2.png"],
    };

    const output = await useCase.execute(input);

    expect(output).toHaveProperty("postId");
    expect((postRepository.save as Mock).mock.calls.length).toBe(1);
  });

  it("should create a private post if isPrivate is true", async () => {
    const input = {
      authorId: randomUUID(),
      content: "Private post",
      imagesUrls: ["image.jpg"],
      isPrivate: true,
    };

    await useCase.execute(input);

    const saveMock = postRepository.save as ReturnType<typeof vi.fn>;
    const postSaved = saveMock.mock.calls[0][0] as Post;

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

  it("should throw an error if author does not exist", async () => {
    const fakeId = randomUUID();

    (userRepository.findUserById as Mock).mockResolvedValue(null);

    const input = {
      authorId: fakeId,
      content: "Post sem autor",
      imagesUrls: ["image.jpg"],
    };

    await expect(() => useCase.execute(input)).rejects.toThrow(
      "Author not exists",
    );
  });
});
