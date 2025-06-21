import { Email } from "@/modules/users/domain/value-objects/Email";
import { describe, it, expect } from "vitest";

describe("Email value-object unit tests", () => {
  describe("Valid emails", () => {
    const validEmails = [
      "user@gmail.com",
      "user.name@gmail.com",
      "user_name@gmail.com",
      "user.name+tag@gmail.com",
      "user.name.lastname@sub.domain.com",
      "user@domain.co",
      "user@sub.domain.co",
      "USER@EXAMPLE.COM",
      " user@example.com ",
    ];

    it.each(validEmails)(
      "should create a valid Email for: '%s'",
      (validEmail) => {
        const email = Email.create({ value: validEmail });
        expect(email.value).toBe(validEmail.trim().toLocaleLowerCase());
      },
    );
  });

  describe("Invalid emails", () => {
    it.each(["", "   "])(
      "should throw error for empty or whitespace-only email: '%s'",
      (invalidEmail) => {
        expect(() => Email.create({ value: invalidEmail })).toThrowError(
          "Email cannot be empty",
        );
      },
    );

    it.each([
      "user..name@gmail.com",
      "user@gmail..com",
      "user..name@gmail..com",
    ])(
      "should throw error for emails with consecutive dots: '%s'",
      (invalidEmail) => {
        expect(() => Email.create({ value: invalidEmail })).toThrowError(
          `Email cannot contain consecutive dots: ${invalidEmail}`,
        );
      },
    );

    it.each([
      "usergmail.com",
      "user@domain",
      "user@domain.",
      "user@.com",
      "user@domain.c",
      "user@@domain.com",
      "user domain.com",
      ".user@gmail.com",
      "user.@gmail.com",
      ".user.@gmail.com",
    ])("should throw error for invalid email format: '%s'", (invalidEmail) => {
      expect(() => Email.create({ value: invalidEmail })).toThrowError(
        `Invalid email format: ${invalidEmail}`,
      );
    });
  });

  it.each([
    "USER@GMAIL.COM",
    "USER.VALID@GMAIL.COM",
    "    USER+VALID@GMAIL.COM    ",
  ])("should change the email to lowercase letters: '%s'", (uppercaseEmail) => {
    const email = Email.create({ value: uppercaseEmail });

    expect(email.value).toBe(uppercaseEmail.trim().toLocaleLowerCase());
  });
});
