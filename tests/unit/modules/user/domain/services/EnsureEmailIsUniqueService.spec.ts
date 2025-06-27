import { EnsureEmailIsUniqueService } from "@/modules/users/domain/services/EnsureEmailIsUniqueService";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Id } from "@/shared/domain/value-objects/Id";
import { MockUserRepository } from "tests/helpers/mocks/users/repositories/MockUserRepository";
import { describe, it, expect } from "vitest";

describe("EnsureEmailIsUniqueService unit test", () => {
  const userRepository = new MockUserRepository();
  const ensureEmailIsUniqueService = new EnsureEmailIsUniqueService(
    userRepository,
  );

  it("should throw an error if email already used by another user", async () => {
    const email = Email.create({ value: "emailToBeError@domain.com" });
    const userId = Id.create<"UserId">({
      value: "370c66b1-c45d-447d-965f-5d1579cb4857",
    });

    await expect(
      ensureEmailIsUniqueService.assertEmailIsUnique(email, userId),
    ).rejects.toThrowError("Email already used: emailtobeerror@domain.com");
  });

  it("shouldn't throw an error if email is used by the same user", async () => {
    const email = Email.create({ value: "emailToBePass@domain.com" });
    const userId = Id.create<"UserId">({
      value: "370c66b1-c45d-447d-965f-5d1579cb4857",
    });

    await expect(
      ensureEmailIsUniqueService.assertEmailIsUnique(email, userId),
    ).resolves.toBeUndefined();
  });

  it("shouldn't throw an error if email isn't used by any user", async () => {
    const email = Email.create({ value: "non-existent@domain.com" });

    await expect(
      ensureEmailIsUniqueService.assertEmailIsUnique(email),
    ).resolves.toBeUndefined();
  });

  it("should throw an error if email is already used and userId is not provided", async () => {
    const email = Email.create({ value: "emailToBeError@domain.com" });

    await expect(
      ensureEmailIsUniqueService.assertEmailIsUnique(email),
    ).rejects.toThrowError("Email already used: emailtobeerror@domain.com");
  });
});
