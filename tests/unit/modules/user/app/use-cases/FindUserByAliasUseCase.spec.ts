import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { User } from "@/modules/users/domain/entities/User";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { FindUserByAliasUseCase } from "@/modules/users/app/use-cases/FindUserByAliasUseCase";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Password } from "@/modules/users/domain/value-objects/Password";

describe("FindUserByAliasUseCase - Unit", () => {
  let mockUserRepository: IUserRepository;
  let useCase: FindUserByAliasUseCase;

  beforeEach(() => {
    mockUserRepository = {
      findUserByAlias: vi.fn(),
      findUserByEmail: vi.fn(),
      save: vi.fn(),
    };

    useCase = new FindUserByAliasUseCase(mockUserRepository);
  });

  it("should return a user when alias exists", async () => {
    const alias = Alias.create({ value: "john_doe" });
    const email = Email.create({ value: "email@domain.com" });
    const name = Name.create({ value: "test" });
    const password = Password.create({ value: "StrongPass123!" });

    const user = User.create({ alias, email, name, password });

    vi.spyOn(mockUserRepository, "findUserByAlias").mockResolvedValueOnce(user);

    const result = await useCase.execute({ alias: "john_doe" });

    expect(result).toBe(user);
    expect(mockUserRepository.findUserByAlias).toHaveBeenCalledWith(alias);
  });

  it("should throw error when user is not found", async () => {
    const alias = Alias.create({ value: "unknown" });

    vi.spyOn(mockUserRepository, "findUserByAlias").mockResolvedValueOnce(null);

    await expect(() => useCase.execute({ alias: "unknown" })).rejects.toThrow(
      `User with alias: ${alias.value}, not found`,
    );
  });

  it("should create Alias VO from input", async () => {
    const spy = vi.spyOn(Alias, "create");

    vi.spyOn(mockUserRepository, "findUserByAlias").mockResolvedValue(null);

    try {
      await useCase.execute({ alias: "check_alias" });
    } catch (err) {
      console.log(err);
    }

    expect(spy).toHaveBeenCalledWith({ value: "check_alias" });
  });
});
