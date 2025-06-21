import { describe, it, expect, vi } from "vitest";
import { Id } from "@/shared/domain/value-objects/Id";
import { IIdGenerator } from "@/shared/domain/services/intefaces/IIdGenerator";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("Id value-object unit tests", () => {
  describe("Manual Id creation", () => {
    it("should create a valid Id with a correct UUID format", () => {
      const id = Id.create<"UserId">({ value: VALID_UUID });
      expect(id.value).toBe(VALID_UUID);
    });

    it.each(["", "not-a-uuid", "1234", "invalid-uuid-000"])(
      "should throw error for invalid ID value: '%s'",
      (invalidId) => {
        expect(() => Id.create<"UserId">({ value: invalidId })).toThrowError(
          invalidId.trim().length === 0
            ? "Id cannot be empty"
            : "Invalid Id format. Id must be a UUID.",
        );
      },
    );
  });

  describe("Id generation using IdGenerator", () => {
    it("should use default IdGenerator and create a UUID", () => {
      const id = Id.generate<"UserId">();
      expect(id.value).toMatch(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      );
    });

    it("should use a mocked IIdGenerator implementation", () => {
      const fakeGenerator: IIdGenerator = {
        generate: vi.fn(() => VALID_UUID),
      };

      const id = Id.generate<"UserId">(fakeGenerator);

      expect(id.value).toBe(VALID_UUID);
      expect(fakeGenerator.generate).toHaveBeenCalled();
    });
  });

  describe("Branding / Type safety", () => {
    it("should preserve branding type for UserId", () => {
      const userId = Id.create<"UserId">({ value: VALID_UUID });

      expect(userId.value).toBe(VALID_UUID);
    });
  });
});
