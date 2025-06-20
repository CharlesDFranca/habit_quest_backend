import { describe, expect, it } from "vitest";
import { ValueObject } from "../../ValueObject";

type StubValueObjectProps = { value: string };

class StubValueObject extends ValueObject<StubValueObjectProps> {
  private constructor(props: StubValueObjectProps) {
    super(props);
  }

  static create(props: StubValueObjectProps) {
    return new StubValueObject(props);
  }

  protected validate(props: StubValueObjectProps): boolean {
    return !!props;
  }
}

describe("ValueObject unit tests", () => {
  it("should create a VO", () => {
    const sut = StubValueObject.create({ value: "StubValueObject" });

    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(ValueObject);
    expect(sut).toBeInstanceOf(StubValueObject);
    expect(typeof sut["props"].value).toBe("string");
  });

  it("should return true when value-objects have the same values", () => {
    const firstVO = StubValueObject.create({ value: "StubValueObject" });
    const secondVO = StubValueObject.create({ value: "StubValueObject" });

    expect(firstVO.isEqual(secondVO)).toBeTruthy();
    expect(secondVO.isEqual(firstVO)).toBeTruthy();
  });

  it("should return false when value-objects haven't the same values", () => {
    const firstVO = StubValueObject.create({ value: "first" });
    const secondVO = StubValueObject.create({ value: "second" });

    expect(firstVO.isEqual(secondVO)).toBeFalsy();
    expect(secondVO.isEqual(firstVO)).toBeFalsy();
  });
});
