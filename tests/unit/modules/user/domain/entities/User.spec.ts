import { describe, it, expect, beforeEach } from "vitest";
import { User } from "@/modules/users/domain/entities/User";
import { randomUUID } from "node:crypto";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";

describe("User entity unit tests", () => {
  let userId: string;
  let initialProps: {
    name: Name;
    email: Email;
    alias: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  beforeEach(() => {
    userId = randomUUID();
    initialProps = {
      name: Name.create({ value: "John Doe" }),
      email: Email.create({ value: "john.doe@example.com" }),
      alias: "johnd",
    };
  });

  it("should expose getters correctly", () => {
    const user = User.create(userId, initialProps);

    expect(user.name.value).toBe("John Doe");
    expect(user.email.value).toBe("john.doe@example.com");
    expect(user.alias).toBe("johnd");
  });

  it("should update name and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newName = Name.create({ value: "Jane Doe" });

    user.updateName(newName);

    expect(user.name.value).toBe("Jane Doe");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update email and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newEmail = Email.create({ value: "jane.doe@example.com" });

    user.updateEmail(newEmail);

    expect(user.email.value).toBe("jane.doe@example.com");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update alias and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    user.updateAlias("janed");

    expect(user.alias).toBe("janed");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should keep createdAt unchanged after updates", async () => {
    const user = User.create(userId, initialProps);
    const originalCreatedAt = user.createdAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newName = Name.create({ value: "John Doe" });

    user.updateName(newName);

    expect(user.createdAt.getTime()).toBe(originalCreatedAt);
  });
});
