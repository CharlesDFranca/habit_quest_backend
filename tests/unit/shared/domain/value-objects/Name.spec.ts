import { Name } from "@/shared/domain/value-objects/Name";
import { ValueObject } from "@/shared/domain/value-objects/ValueObject";
import { describe, it, expect } from "vitest";

describe("Name value-object unit tests", () => {
  it("should create a Name", () => {
    const sut = Name.create({ value: "JOHN DOE" });

    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(ValueObject);
    expect(sut).toBeInstanceOf(Name);
    expect(sut.value).toBe("JOHN DOE");
  });

  it.each(["", "     "])(
    "should throw an error if the name value is empty. '%s'",
    (name) => {
      expect(() => Name.create({ value: name })).toThrowError(
        `Name cannot be empty`,
      );
    },
  );

  it("should throw an error if the name value is too short", () => {
    const MIN_LENGTH = 3;

    expect(() => Name.create({ value: "A" })).toThrowError(
      `Name cannot be too short. [MIN: ${MIN_LENGTH}]`,
    );
  });

  it("should throw an error if the name value is too long", () => {
    const MAX_LENGTH = 20;

    expect(() =>
      Name.create({ value: "A".repeat(MAX_LENGTH + 1) }),
    ).toThrowError(`Name cannot be too long. [MAX: ${MAX_LENGTH}]`);
  });

  it("should throw an error if the name is entirely numeric", () => {
    expect(() => Name.create({ value: "1234" })).toThrowError(
      `Name cannot be entirely numeric`,
    );
  });
});
