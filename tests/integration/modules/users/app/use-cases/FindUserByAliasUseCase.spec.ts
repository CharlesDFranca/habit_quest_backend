import "reflect-metadata";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaUserRepository } from "@/modules/users/infra/repositories/PrismaUserRepository";
import { User } from "@/modules/users/domain/entities/User";
import { FindUserByAliasUseCase } from "@/modules/users/app/use-cases/FindUserByAliasUseCase";
import { prisma } from "@/shared/infra/database/PrismaClient";
import { Id } from "@/shared/domain/value-objects/Id";

describe("FindUserByAliasUseCase - Integration", () => {
  const userRepository = new PrismaUserRepository();
  const useCase = new FindUserByAliasUseCase(userRepository);

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: {
        id: Id.generate().value,
        alias: "test_user",
        email: "test@example.com",
        name: "test",
        password: "StrongPass123!",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should find a user by alias", async () => {
    const user = await useCase.execute({ alias: "test_user" });

    expect(user).toBeInstanceOf(User);
    expect(user.alias.value).toBe("test_user");
    expect(user.email.value).toBe("test@example.com");
  });

  it("should throw error if user is not found", async () => {
    await expect(() =>
      useCase.execute({ alias: "non_existent_user" }),
    ).rejects.toThrow("User with alias: non_existent_user, not found");
  });
});
