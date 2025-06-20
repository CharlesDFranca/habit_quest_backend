import { describe, it, expect, beforeEach } from "vitest";
import { User } from "@/modules/users/domain/entities/User";
import { randomUUID } from "node:crypto";

describe("User Entity Unit Tests (Focused on User logic)", () => {
  let userId: string;
  let initialProps: {
    name: string;
    email: string;
    alias: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  beforeEach(() => {
    userId = randomUUID();
    initialProps = {
      name: "John Doe",
      email: "john.doe@example.com",
      alias: "johnd",
    };
  });

  it("should expose getters correctly", () => {
    const user = User.create(userId, initialProps);

    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.alias).toBe("johnd");
  });

  it("should update name and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    user.updateName("Jane Doe");

    expect(user.name).toBe("Jane Doe");
    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
  });

  it("should update email and refresh updatedAt", async () => {
    const user = User.create(userId, initialProps);
    const oldUpdatedAt = user.updatedAt.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    user.updateEmail("jane.doe@example.com");

    expect(user.email).toBe("jane.doe@example.com");
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

    user.updateName("Another Name");

    expect(user.createdAt.getTime()).toBe(originalCreatedAt);
  });
});
