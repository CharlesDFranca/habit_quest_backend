import { IdGenerator } from "@/shared/domain/services/IdGenerator";
import { describe, it, expect } from "vitest";

describe("IdGenerator unit tests", () => {
  const sut = new IdGenerator();

  it("should return a string", () => {
    const id = sut.generate();

    expect(id).toBeDefined();
    expect(typeof id).toBe("string");
  });
});
