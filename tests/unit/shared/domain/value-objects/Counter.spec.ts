import { Counter } from "@/shared/domain/value-objects/Counter";
import { describe, it, expect, beforeEach } from "vitest";

describe("Counter value-object unit tests", () => {
  let sut: Counter;

  beforeEach(() => {
    sut = Counter.create({ value: 0 });
  });

  it("should expose getter correctly", () => {
    expect(sut.value).toBe(0);
  });

  it("should increment the counter by one", () => {
    expect(sut.value).toBe(0);

    sut = sut.incrementByOne();

    expect(sut.value).toBe(1);
  });

  it("should decrement the counter by one", () => {
    sut = sut.incrementByOne();

    expect(sut.value).toBe(1);

    sut = sut.decrementByOne();

    expect(sut.value).toBe(0);
  });

  it("shouldn't decrement the counter by one if value is zero", () => {
    expect(sut.value).toBe(0);

    sut = sut.decrementByOne();

    expect(sut.value).toBe(0);
  });

  it("should increment the counter by ten", () => {
    expect(sut.value).toBe(0);

    sut = sut.incrementBy(10);

    expect(sut.value).toBe(10);
  });

  it("should decrement the counter by five", () => {
    sut = sut.incrementBy(10);

    expect(sut.value).toBe(10);

    sut = sut.decrementBy(5);

    expect(sut.value).toBe(5);
  });

  it("should throw an error if the counter value is less than amount to subtract", () => {
    sut = sut.incrementBy(10);

    expect(sut.value).toBe(10);

    expect(() => sut.decrementBy(20)).toThrowError(
      "It is not possible to decrement if the value to be subtracted is greater than the current value of the counter",
    );
  });
});
