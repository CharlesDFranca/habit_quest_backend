import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { User } from "@/modules/users/domain/entities/User";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Password } from "@/modules/users/domain/value-objects/Password";
import { Id } from "@/shared/domain/value-objects/Id";
import { FindUserByIdUseCase } from "@/modules/users/app/use-cases/FindUserByIdUseCase";

describe("FindUserByIdUseCase unit tests", () => {
  let mockUserRepository: IUserRepository;
  let useCase: FindUserByIdUseCase;

  beforeEach(() => {
    mockUserRepository = {
      findUserById: vi.fn(),
    } as unknown as IUserRepository;

    useCase = new FindUserByIdUseCase(mockUserRepository);
  });

  it("should return a user when id exists", async () => {
    const alias = Alias.create({ value: "john_doe" });
    const email = Email.create({ value: "email@domain.com" });
    const name = Name.create({ value: "test" });
    const password = Password.create({ value: "StrongPass123!" });
    const id = Id.generate<"UserId">();

    const user = User.create({ alias, email, name, password }, id);

    vi.spyOn(mockUserRepository, "findUserById").mockResolvedValueOnce(user);

    const result = await useCase.execute({ userId: id.value });

    expect(result).toStrictEqual({
      userId: user.id.value,
      name: user.name.value,
      alias: user.alias.value,
      email: user.email.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    expect(mockUserRepository.findUserById).toHaveBeenCalledWith(id);
  });

  it("should throw error when user is not found", async () => {
    const id = Id.generate();

    vi.spyOn(mockUserRepository, "findUserById").mockResolvedValueOnce(null);

    await expect(() => useCase.execute({ userId: id.value })).rejects.toThrow(
      `User not found by "id": ${id.value}`,
    );
  });
});
