import { describe, it, beforeAll, afterAll, expect } from "vitest";

import { PrismaUserRepository } from "@/modules/users/infra/repositories/PrismaUserRepository";

import { Name } from "@/shared/domain/value-objects/Name";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Password } from "@/modules/users/domain/value-objects/Password";
import { User } from "@/modules/users/domain/entities/User";
import { prisma } from "@/shared/infra/database/PrismaClient";

const repository = new PrismaUserRepository();

describe("PrismaUserRepository integration tests", () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should save a user and retrieve it by alias", async () => {
    const user = User.create({
      name: Name.create({ value: "Alice" }),
      alias: Alias.create({ value: "alice123" }),
      email: Email.create({ value: "alice@example.com" }),
      password: Password.create({ value: "StrongPass!123" }),
    });

    const savedUser = await repository.save(user);

    expect(savedUser).toBeInstanceOf(User);
    expect(savedUser.alias.value).toBe("alice123");

    const foundByAlias = await repository.findUserByAlias(
      Alias.create({ value: "alice123" }),
    );

    expect(foundByAlias).not.toBeNull();
    expect(foundByAlias?.email.value).toBe("alice@example.com");
  });

  it("should retrieve a user by email", async () => {
    const email = Email.create({ value: "alice@example.com" });

    const foundByEmail = await repository.findUserByEmail(email);

    expect(foundByEmail).not.toBeNull();
    expect(foundByEmail?.alias.value).toBe("alice123");
  });
});
