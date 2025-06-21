import { describe, it, expect, beforeEach } from "vitest";
import { User } from "@/modules/users/domain/entities/User";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Password } from "@/modules/users/domain/value-objects/Password";
import { Id } from "@/shared/domain/value-objects/Id";

describe("User entity unit tests", () => {
  let userId: Id<"UserId">;
  let initialProps: {
    name: Name;
    alias: Alias;
    email: Email;
    password: Password;
    createdAt?: Date;
    updatedAt?: Date;
  };

  beforeEach(() => {
    userId = Id.create<"UserId">({
      value: "550e8400-e29b-41d4-a716-446655440000",
    });

    initialProps = {
      name: Name.create({ value: "John Doe" }),
      alias: Alias.create({ value: "johnd" }),
      email: Email.create({ value: "john.doe@example.com" }),
      password: Password.create({ value: "(K4m1k4z3)" }),
    };
  });

  it("should expose getters correctly", () => {
    const user = User.create(initialProps, userId);

    expect(user.id!.value).toBe(userId.value);
    expect(user.name.value).toBe("John Doe");
    expect(user.email.value).toBe("john.doe@example.com");
    expect(user.alias.value).toBe("johnd");
    expect(user.password.value).toBe("(K4m1k4z3)");
  });

  it("should update name and refresh updatedAt", async () => {
    const user = User.create(initialProps, userId);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newName = Name.create({ value: "Jane Doe" });
    user.updateName(newName);

    expect(user.name.value).toBe("Jane Doe");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update email and refresh updatedAt", async () => {
    const user = User.create(initialProps, userId);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newEmail = Email.create({ value: "jane.doe@example.com" });
    user.updateEmail(newEmail);

    expect(user.email.value).toBe("jane.doe@example.com");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update alias and refresh updatedAt", async () => {
    const user = User.create(initialProps, userId);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newAlias = Alias.create({ value: "janed" });
    user.updateAlias(newAlias);

    expect(user.alias.value).toBe("janed");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update password and refresh updatedAt", async () => {
    const user = User.create(initialProps, userId);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newPassword = Password.create({ value: "(Cru7cr3d0)" });
    user.updatePassword(newPassword);

    expect(user.password.value).toBe("(Cru7cr3d0)");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should keep createdAt unchanged after updates", async () => {
    const user = User.create(initialProps, userId);
    const originalCreatedAt = user.createdAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    const newName = Name.create({ value: "Another Name" });
    user.updateName(newName);

    expect(user.createdAt.getTime()).toBe(originalCreatedAt);
  });

  it("should generate id automatically if not provided", () => {
    const user = User.create(initialProps);

    expect(user.id).toBeDefined();
    expect(user.id).toBeInstanceOf(Id);
  });
});
