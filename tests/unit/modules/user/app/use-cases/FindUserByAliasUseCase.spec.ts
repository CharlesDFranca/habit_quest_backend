import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { User } from "@/modules/users/domain/entities/User";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { FindUserByAliasUseCase } from "@/modules/users/app/use-cases/FindUserByAliasUseCase";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Password } from "@/modules/users/domain/value-objects/Password";

describe("FindUserByAliasUseCase unit tests", () => {
  let mockUserRepository: IUserRepository;
  let useCase: FindUserByAliasUseCase;

  beforeEach(() => {
    mockUserRepository = {
      findUserByAlias: vi.fn(),
    } as unknown as IUserRepository;

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

    expect(result).toStrictEqual({
      userId: user.id.value,
      name: user.name.value,
      alias: user.alias.value,
      email: user.email.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    expect(mockUserRepository.findUserByAlias).toHaveBeenCalledWith(alias);
  });

  it("should throw error when user is not found", async () => {
    const alias = Alias.create({ value: "unknown" });

    vi.spyOn(mockUserRepository, "findUserByAlias").mockResolvedValueOnce(null);

    await expect(() => useCase.execute({ alias: "unknown" })).rejects.toThrow(
      `User not found by alias: ${alias.value}`,
    );
  });
});
