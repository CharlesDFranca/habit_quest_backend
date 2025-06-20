import { describe, it, expect } from "vitest";
import { randomUUID } from "node:crypto";
import { Entity } from "../../Entity";

class StubEntity extends Entity {
  update() {
    this.touch();
  }
}

describe("EnvConfig unit tests", () => {
  it("should be create an entity with id, createdAt and updatedAt", () => {
    const sut = new StubEntity(randomUUID());

    expect(sut.id).toBeDefined();
    expect(typeof sut.id).toBe("string");

    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.updatedAt).toBeInstanceOf(Date);
  });

  it("should protect createAt and updatedAt from external mutation", () => {
    const sut = new StubEntity(randomUUID());

    const originalCreatedAt = sut.createdAt;
    const originalUpdatedAt = sut.updatedAt!;

    originalCreatedAt.setFullYear(1999);
    originalUpdatedAt.setFullYear(1999);

    expect(sut.createdAt.getFullYear()).not.toBe(1999);
    expect(sut.updatedAt!.getFullYear()).not.toBe(1999);
  });

  it("should allow creation with specific createdAt and updatedAt (like from DB)", () => {
    const specificCreatedAt = new Date("2020-01-01T00:00:00Z");
    const specificUpdatedAt = new Date("2021-01-01T00:00:00Z");

    const sut = new StubEntity(
      randomUUID(),
      specificCreatedAt,
      specificUpdatedAt,
    );

    expect(sut.createdAt.getTime()).toBe(specificCreatedAt.getTime());
    expect(sut.updatedAt!.getTime()).toBe(specificUpdatedAt.getTime());
  });

  it("should update updatedAt when touch() is called (via update)", async () => {
    const sut = new StubEntity(randomUUID());

    const beforeTouch = sut.updatedAt!.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    sut.update();

    const afterTouch = sut.updatedAt!.getTime();

    expect(afterTouch).toBeGreaterThan(beforeTouch);
  });
});
