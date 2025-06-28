import "reflect-metadata";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateUserUseCase } from "@/modules/users/app/use-cases/CreateUserUseCase";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { IEnsureAliasIsUniqueService } from "@/modules/users/domain/services/interfaces/IEnsureAliasIsUniqueService";
import { IEnsureEmailIsUniqueService } from "@/modules/users/domain/services/interfaces/IEnsureEmailIsUniqueService";
import { IHashProvider } from "@/modules/users/app/interfaces/IHashProvider";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Alias } from "@/shared/domain/value-objects/Alias";

describe("CreateUserUseCase", () => {
  let userRepository: IUserRepository;
  let ensureAliasIsUniqueService: IEnsureAliasIsUniqueService;
  let ensureEmailIsUniqueService: IEnsureEmailIsUniqueService;
  let hashProvider: IHashProvider;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = {
      save: vi.fn(),
    } as unknown as IUserRepository;

    ensureAliasIsUniqueService = {
      assertAliasIsUnique: vi.fn(),
    };

    ensureEmailIsUniqueService = {
      assertEmailIsUnique: vi.fn(),
    };

    hashProvider = {
      hash: vi.fn().mockResolvedValue("hashed-password"),
      compare: vi.fn(),
    };

    useCase = new CreateUserUseCase(
      userRepository,
      ensureAliasIsUniqueService,
      ensureEmailIsUniqueService,
      hashProvider,
    );
  });

  it("should create a user and return the userId", async () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      alias: "john123",
      password: "Passw0rd!",
    };

    const result = await useCase.execute(input);

    expect(result).toHaveProperty("userId");
    expect(ensureEmailIsUniqueService.assertEmailIsUnique).toHaveBeenCalledWith(
      Email.create({ value: input.email }),
    );
    expect(ensureAliasIsUniqueService.assertAliasIsUnique).toHaveBeenCalledWith(
      Alias.create({ value: input.alias }),
    );
    expect(hashProvider.hash).toHaveBeenCalledWith(input.password);
    expect(userRepository.save).toBeCalled();
  });

  it("should throw an error if email already used", async () => {
    vi.spyOn(
      ensureEmailIsUniqueService,
      "assertEmailIsUnique",
    ).mockRejectedValueOnce(new Error("Email already used"));

    await expect(
      useCase.execute({
        name: "Jane",
        email: "used@email.com",
        alias: "jane123",
        password: "Passw0rd!",
      }),
    ).rejects.toThrow("Email already used");
  });

  it("should throw an error if alias already used", async () => {
    vi.spyOn(
      ensureAliasIsUniqueService,
      "assertAliasIsUnique",
    ).mockRejectedValueOnce(new Error("Alias already used"));

    await expect(
      useCase.execute({
        name: "Jane",
        email: "jane@email.com",
        alias: "usedAlias",
        password: "Passw0rd!",
      }),
    ).rejects.toThrow("Alias already used");
  });
});
