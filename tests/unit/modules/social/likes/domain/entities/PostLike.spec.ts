import { PostLike } from "@/modules/social/likes/domain/entities/PostLike";
import { Id } from "@/shared/domain/value-objects/Id";
import { describe, it, expect } from "vitest";

describe("PostLike entity unit tests", () => {
  const sut: PostLike = PostLike.create({ userId: Id.generate() });

  it("should expose getters correctly", () => {
    expect(sut.id).toBeDefined();
    expect(sut.userId).toBeDefined();

    expect(sut.id).toBeInstanceOf(Id);
    expect(sut.userId).toBeInstanceOf(Id);
  });
});
