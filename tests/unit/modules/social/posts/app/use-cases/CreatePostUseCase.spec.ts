import "reflect-metadata";

import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { CreatePostUseCase } from "@/modules/social/posts/app/use-cases/CreatePostUseCase";
import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { IImageStorageService } from "@/shared/app/interfaces/IImageStorageService";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { User } from "@/modules/users/domain/entities/User";
import { Id } from "@/shared/domain/value-objects/Id";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Password } from "@/modules/users/domain/value-objects/Password";
import { randomUUID } from "node:crypto";

describe("CreatePostUseCase unit tests", () => {
  let postRepository: IPostRepository;
  let userRepository: IUserRepository;
  let storageImageService: IImageStorageService;
  let useCase: CreatePostUseCase;

  const mockUserId = randomUUID();

  const createFakeImage = (name = "image.jpg") => ({
    buffer: Buffer.from(randomUUID()),
    mimeType: "image/jpeg",
    originalName: name,
  });

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
          Id.create({ value: mockUserId }),
        ),
      ),
    } as unknown as IUserRepository;

    storageImageService = {
      save: vi.fn().mockResolvedValue("/uploads/test-image.webp"),
      delete: vi.fn(),
    };

    useCase = new CreatePostUseCase(
      postRepository,
      userRepository,
      storageImageService,
    );
  });

  it("should create a post with valid input and store image", async () => {
    const input = {
      authorId: mockUserId,
      content: "Hello world!",
      imagesUrls: [createFakeImage()],
    };

    const output = await useCase.execute(input);

    expect(output).toHaveProperty("postId");

    expect((postRepository.save as Mock).mock.calls.length).toBe(1);

    const postSaved = (postRepository.save as Mock).mock.calls[0][0] as Post;
    expect(postSaved.content.value).toBe(input.content);
    expect(postSaved.images).toHaveLength(1);
    expect(postSaved.images[0].value).toBe("/uploads/test-image.webp");

    expect(storageImageService.save).toHaveBeenCalledTimes(1);
    expect(storageImageService.save).toHaveBeenCalledWith(input.imagesUrls[0]);
  });

  it("should create a private post if isPrivate is true", async () => {
    const input = {
      authorId: mockUserId,
      content: "Private post",
      imagesUrls: [createFakeImage()],
      isPrivate: true,
    };

    await useCase.execute(input);

    const saveMock = postRepository.save as Mock;
    const postSaved = saveMock.mock.calls[0][0] as Post;

    expect(postSaved.isPrivate).toBe(true);
  });

  it("should call save for each image", async () => {
    const input = {
      authorId: mockUserId,
      content: "Multiple images",
      imagesUrls: [createFakeImage("a.jpg"), createFakeImage("b.png")],
    };

    await useCase.execute(input);

    expect(storageImageService.save).toHaveBeenCalledTimes(2);
    expect(storageImageService.save).toHaveBeenNthCalledWith(
      1,
      input.imagesUrls[0],
    );
    expect(storageImageService.save).toHaveBeenNthCalledWith(
      2,
      input.imagesUrls[1],
    );
  });

  it("should throw an error if author does not exist", async () => {
    (userRepository.findUserById as Mock).mockResolvedValue(null);

    const input = {
      authorId: randomUUID(),
      content: "Test",
      imagesUrls: [createFakeImage()],
    };

    await expect(() => useCase.execute(input)).rejects.toThrow(
      "Author not exists",
    );
  });
});
