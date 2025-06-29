import "reflect-metadata";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaUserRepository } from "@/modules/users/infra/repositories/PrismaUserRepository";
import { User } from "@/modules/users/domain/entities/User";
import { prisma } from "@/shared/infra/database/PrismaClient";
import { Id } from "@/shared/domain/value-objects/Id";
import { FindUserByIdUseCase } from "@/modules/users/app/use-cases/FindUserByIdUseCase";

describe("FindUserByIdUseCase integration tests", () => {
  const userRepository = new PrismaUserRepository();
  const useCase = new FindUserByIdUseCase(userRepository);
  const userId = Id.generate<"UserId">();

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: {
        id: userId.value,
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

  it("should find a user by id", async () => {
    const user = await useCase.execute({ userId: userId.value });

    expect(user).toBeInstanceOf(User);
    expect(user.id.value).toBe(userId.value);
  });

  it("should throw error if user is not found", async () => {
    await expect(() =>
      useCase.execute({ userId: Id.generate<"UserId">().value }),
    ).rejects.toThrow("User not found");
  });
});
