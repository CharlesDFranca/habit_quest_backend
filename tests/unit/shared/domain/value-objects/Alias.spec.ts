import { describe, it, expect } from "vitest";
import { Alias } from "@/shared/domain/value-objects/Alias";

describe("Alias value-object unit tests", () => {
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 20;

  describe("Successful creation (valid aliases)", () => {
    it.each([
      "user123",
      "user_name",
      "user.name",
      "user-name",
      "user@name",
      "User!Name?",
      "User123_456",
      "a".repeat(MIN_LENGTH),
      "a".repeat(MAX_LENGTH),
    ])("should create alias: '%s'", (validAlias) => {
      const alias = Alias.create({ value: validAlias });
      expect(alias.value).toBe(validAlias);
    });
  });

  describe("Validation errors", () => {
    it.each(["", "   "])(
      "should throw an error for empty or whitespace-only alias: '%s'",
      (invalidAlias) => {
        expect(() => Alias.create({ value: invalidAlias })).toThrowError(
          "Alias cannot be empty",
        );
      },
    );

    it.each(["ab", "a"])(
      "should throw an error for too short alias: '%s'",
      (shortAlias) => {
        expect(() => Alias.create({ value: shortAlias })).toThrowError(
          `Alias cannot be too short. [MIN: ${MIN_LENGTH}]`,
        );
      },
    );

    it("should throw an error for alias too long", () => {
      const tooLongAlias = "a".repeat(MAX_LENGTH + 1);

      expect(() => Alias.create({ value: tooLongAlias })).toThrowError(
        `Alias cannot be too long. [MAX: ${MAX_LENGTH}]`,
      );
    });

    it.each([
      "user#name",
      "user$name",
      "user%name",
      "user^name",
      "user&name",
      "user*name",
      "user(name)",
      "user=name",
      "user+name",
      "user~name",
      "user/name",
      "user\\name",
      "user|name",
      "user,name",
      "user;name",
      "user:name",
      "user<name>",
      "user>name",
    ])(
      "should throw error for alias with invalid characters: '%s'",
      (invalidAlias) => {
        expect(() => Alias.create({ value: invalidAlias })).toThrowError(
          `Alias contains invalid characters. Allowed: letters, numbers, . _ - @ ! ?.\nInvalid Alias: ${invalidAlias}`,
        );
      },
    );

    it.each([
      ".username",
      "_username",
      "-username",
      "@username",
      "!username",
      "?username",
    ])(
      "should throw error for alias starting with special character: '%s'",
      (invalidAlias) => {
        expect(() => Alias.create({ value: invalidAlias })).toThrowError(
          `Alias cannot start with a special character.\nInvalid Alias: ${invalidAlias}`,
        );
      },
    );

    it.each(["!!!", "@@@", "---", "___", "...", "???", "-_-."])(
      "should throw error for alias with only special characters: '%s'",
      (invalidAlias) => {
        expect(() => Alias.create({ value: invalidAlias })).toThrowError(
          `Alias must contain at least one letter or number.\nInvalid Alias: ${invalidAlias}`,
        );
      },
    );

    it.each(["123", "456789", "0000"])(
      "should throw error for alias that is entirely numeric: '%s'",
      (numericAlias) => {
        expect(() => Alias.create({ value: numericAlias })).toThrowError(
          "Alias cannot be entirely numeric",
        );
      },
    );
  });
});
