import { EnsureAliasIsUniqueService } from "@/modules/users/domain/services/EnsureAliasIsUniqueService";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Id } from "@/shared/domain/value-objects/Id";
import { MockUserRepository } from "tests/helpers/mocks/users/repositories/MockUserRepository";
import { describe, it, expect } from "vitest";

describe("EnsureAliasIsUniqueService unit test", () => {
  const userRepository = new MockUserRepository();
  const ensureAliasIsUniqueService = new EnsureAliasIsUniqueService(
    userRepository,
  );

  it("should throw an error if alias already used by another user", async () => {
    const alias = Alias.create({ value: "ToBeError" });
    const userId = Id.create<"UserId">({
      value: "370c66b1-c45d-447d-965f-5d1579cb4857",
    });

    await expect(
      ensureAliasIsUniqueService.assertAliasIsUnique(alias, userId),
    ).rejects.toThrowError();
  });

  it("shouldn't throw an error if alias is used by the same user", async () => {
    const alias = Alias.create({ value: "ToBePass" });
    const userId = Id.create<"UserId">({
      value: "370c66b1-c45d-447d-965f-5d1579cb4857",
    });

    await expect(
      ensureAliasIsUniqueService.assertAliasIsUnique(alias, userId),
    ).resolves.toBeUndefined();
  });

  it("shouldn't throw an error if alias isn't used by another user", async () => {
    const alias = Alias.create({ value: "non-existent" });
    const userId = Id.create<"UserId">({
      value: "370c66b1-c45d-447d-965f-5d1579cb4857",
    });

    await expect(
      ensureAliasIsUniqueService.assertAliasIsUnique(alias, userId),
    ).resolves.toBeUndefined();
  });
});
