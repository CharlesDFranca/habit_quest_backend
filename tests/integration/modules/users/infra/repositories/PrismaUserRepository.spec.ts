import "reflect-metadata";
import { describe, it, beforeEach, expect } from "vitest";

import { PrismaUserRepository } from "@/modules/users/infra/repositories/PrismaUserRepository";
import { User } from "@/modules/users/domain/entities/User";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Name } from "@/shared/domain/value-objects/Name";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Password } from "@/modules/users/domain/value-objects/Password";

import { prisma } from "@/shared/infra/database/PrismaClient";

describe("PrismaUserRepository (integration)", () => {
  const repository = new PrismaUserRepository();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should save a new user", async () => {
    const user = User.create({ 
      name: Name.create({ value: "Test User" }),
      alias: Alias.create({ value: "test_user" }),
      email: Email.create({ value: "test@example.com" }),
      password: Password.create({ value: "StrongP@ss1" }),
    });

    const savedUser = await repository.save(user);

    expect(savedUser).toBeInstanceOf(User);
    expect(savedUser.email.value).toBe("test@example.com");
    expect(savedUser.alias.value).toBe("test_user");
  });

  it("should find a user by email", async () => {
    const user = User.create({
      name: Name.create({ value: "Email Finder" }),
      alias: Alias.create({ value: "email_finder" }),
      email: Email.create({ value: "findme@example.com" }),
      password: Password.create({ value: "StrongP@ss1" }),
    });

    await repository.save(user);

    const found = await repository.findUserByEmail(user.email);
    expect(found).not.toBeNull();
    expect(found?.alias.value).toBe("email_finder");
  });

  it("should find a user by alias", async () => {
    const user = User.create({
      name: Name.create({ value: "Alias Finder" }),
      alias: Alias.create({ value: "alias_finder" }),
      email: Email.create({ value: "alias@example.com" }),
      password: Password.create({ value: "StrongP@ss1" }),
    });

    await repository.save(user);

    const found = await repository.findUserByAlias(user.alias);
    expect(found).not.toBeNull();
    expect(found?.email.value).toBe("alias@example.com");
  });

  it("should return null if user not found by email", async () => {
    const email = Email.create({ value: "notfound@example.com" });
    const found = await repository.findUserByEmail(email);
    expect(found).toBeNull();
  });

  it("should return null if user not found by alias", async () => {
    const alias = Alias.create({ value: "unknown_alias" });
    const found = await repository.findUserByAlias(alias);
    expect(found).toBeNull();
  });
});
