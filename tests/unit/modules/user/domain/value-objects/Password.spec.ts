import { describe, it, expect } from "vitest";
import { ValueObject } from "@/shared/domain/value-objects/ValueObject";
import { Password } from "@/modules/users/domain/value-objects/Password";

describe("Password value-object unit tests", () => {
  const MIN_LENGTH = 8;
  const MAX_LENGTH = 20;

  describe("Successful creation (valid passwords)", () => {
    it.each([
      "Password1!",
      "Abcdef1@",
      "123Abcde!",
      "Test123$",
      "ValidPass9%",
      "A1b2C3d4#",
      "XxYyZz99!",
    ])("should create password: '%s'", (validPassword) => {
      const sut = Password.create({ value: validPassword });
      expect(sut.value).toBe(validPassword.trim());
      expect(sut).toBeInstanceOf(Password);
      expect(sut).toBeInstanceOf(ValueObject);
    });
  });

  describe("Validation errors", () => {
    it.each(["", "   "])(
      "should throw error for empty or whitespace-only password: '%s'",
      (invalidPassword) => {
        expect(() => Password.create({ value: invalidPassword })).toThrowError(
          "Password cannot be empty",
        );
      },
    );

    it("should throw error for password too short", () => {
      const shortPassword = "Aa1@bc";
      expect(() => Password.create({ value: shortPassword })).toThrowError(
        `Password cannot be too short: [MIN: ${MIN_LENGTH}]`,
      );
    });

    it("should throw error for password too long", () => {
      const longPassword = "A1b2C3d4E5F6G7H8I9J0K!";
      expect(() => Password.create({ value: longPassword })).toThrowError(
        `Password cannot be too long: [MAX: ${MAX_LENGTH}]`,
      );
    });

    it("should throw error if missing lowercase letter", () => {
      const password = "PASSWORD1!";
      expect(() => Password.create({ value: password })).toThrowError(
        "Password must have at least one lowercase letter",
      );
    });

    it("should throw error if missing uppercase letter", () => {
      const password = "password1!";
      expect(() => Password.create({ value: password })).toThrowError(
        "Password must have at least one uppercase letter",
      );
    });

    it("should throw error if missing number", () => {
      const password = "Password!";
      expect(() => Password.create({ value: password })).toThrowError(
        "Password must have at least one number",
      );
    });

    it("should throw error if missing special character", () => {
      const password = "Password1";
      expect(() => Password.create({ value: password })).toThrowError(
        "Password must have at least one special character",
      );
    });
  });

  it("should accept hash without validations", () => {
    const invalidButHashed = "invalid_hash";
    expect(() =>
      Password.createFromHash({ value: invalidButHashed }),
    ).not.toThrow();
  });

  it("should reject empty hash", () => {
    expect(() => Password.createFromHash({ value: "" })).toThrowError(
      "Password cannot be empty",
    );
  });

  it("should accept hash that violates complexity rules", () => {
    const noUppercase = "lowercase1!";
    const noLowercase = "UPPERCASE1!";
    const noNumber = "Password!";
    const noSpecial = "Password1";

    expect(() => Password.createFromHash({ value: noUppercase })).not.toThrow();
    expect(() => Password.createFromHash({ value: noLowercase })).not.toThrow();
    expect(() => Password.createFromHash({ value: noNumber })).not.toThrow();
    expect(() => Password.createFromHash({ value: noSpecial })).not.toThrow();
  });
});
