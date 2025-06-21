import { describe, it, expect } from "vitest";
import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";

class StubEntity extends Entity<"UserId"> {
  update() {
    this.touch();
  }
}

describe("EnvConfig unit tests", () => {
  const createValidId = () =>
    Id.create<"UserId">({
      value: "550e8400-e29b-41d4-a716-446655440000",
    });

  it("should be create an entity with id, createdAt and updatedAt", () => {
    const sut = new StubEntity(createValidId());

    expect(sut.id).toBeDefined();
    expect(typeof sut.id?.value).toBe("string");

    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.updatedAt).toBeInstanceOf(Date);
  });

  it("should protect createAt and updatedAt from external mutation", () => {
    const sut = new StubEntity(createValidId());

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
      createValidId(),
      specificCreatedAt,
      specificUpdatedAt,
    );

    expect(sut.createdAt.getTime()).toBe(specificCreatedAt.getTime());
    expect(sut.updatedAt!.getTime()).toBe(specificUpdatedAt.getTime());
  });

  it("should update updatedAt when touch() is called (via update)", async () => {
    const sut = new StubEntity(createValidId());

    const beforeTouch = sut.updatedAt!.getTime();

    await new Promise((resolve) => setTimeout(resolve, 10));

    sut.update();

    const afterTouch = sut.updatedAt!.getTime();

    expect(afterTouch).toBeGreaterThan(beforeTouch);
  });

  it("should throw an error if createdAt is after updatedAt", () => {
    const createdAt = new Date("2022-01-01T00:00:00Z");
    const updatedAt = new Date("2021-01-01T00:00:00Z");

    expect(() => {
      new StubEntity(createValidId(), createdAt, updatedAt);
    }).toThrowError("Entity creation date cannot be after updated date");
  });

  it("should return true when two entities have the same id (isEqual)", () => {
    const id = createValidId();

    const entity1 = new StubEntity(id);
    const entity2 = new StubEntity(id);

    expect(entity1.isEqual(entity2)).toBe(true);
  });

  it("should return false when two entities have different ids (isEqual)", () => {
    const entity1 = new StubEntity(createValidId());
    const entity2 = new StubEntity(createValidId());

    expect(entity1.isEqual(entity2)).toBe(false);
  });
});
