import { describe, it, expect, beforeEach } from "vitest";
import { User } from "@/modules/users/domain/entities/User";
import { randomUUID } from "node:crypto";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Password } from "@/modules/users/domain/value-objects/Password";

describe("User entity unit tests", () => {
  let userId: string;
  let initialProps: {
    name: Name;
    alias: Alias;
    email: Email;
    password: Password;
    createdAt?: Date;
    updatedAt?: Date;
  };

  beforeEach(() => {
    userId = randomUUID();
    initialProps = {
      name: Name.create({ value: "John Doe" }),
      alias: Alias.create({ value: "johnd" }),
      email: Email.create({ value: "john.doe@example.com" }),
      password: Password.create({ value: "(K4m1k4z3)" }),
    };
  });

  it("should expose getters correctly", () => {
    const user = User.create(userId, initialProps);

    expect(user.name.value).toBe("John Doe");
    expect(user.email.value).toBe("john.doe@example.com");
    expect(user.alias.value).toBe("johnd");
    expect(user.password.value).toBe("(K4m1k4z3)");
  });

  it("should update name and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);

    expect(user.name.value).toBe("John Doe");

    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newName = Name.create({ value: "Jane Doe" });

    user.updateName(newName);

    expect(user.name.value).not.toBe("John Doe");
    expect(user.name.value).toBe("Jane Doe");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update email and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);

    expect(user.email.value).toBe("john.doe@example.com");

    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newEmail = Email.create({ value: "jane.doe@example.com" });

    user.updateEmail(newEmail);

    expect(user.email.value).not.toBe("john.doe@example.com");
    expect(user.email.value).toBe("jane.doe@example.com");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update alias and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);

    expect(user.alias.value).toBe("johnd");

    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const alias = Alias.create({ value: "janed" });

    user.updateAlias(alias);

    expect(user.alias.value).not.toBe("johnd");
    expect(user.alias.value).toBe("janed");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update password and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);

    expect(user.password.value).toBe("(K4m1k4z3)");

    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newPassword = Password.create({ value: "(Cru7cr3d0)" });

    user.updatePassword(newPassword);

    expect(user.password.value).not.toBe("(K4m1k4z3)");
    expect(user.password.value).toBe("(Cru7cr3d0)");
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
