import { CommentLike } from "@/modules/social/likes/domain/entities/CommentLike";
import { Id } from "@/shared/domain/value-objects/Id";
import { describe, it, expect } from "vitest";

describe("CommentLike entity unit tests", () => {
  const sut: CommentLike = CommentLike.create({ userId: Id.generate() });

  it("should expose getters correctly", () => {
    expect(sut.id).toBeDefined();
    expect(sut.userId).toBeDefined();

    expect(sut.id).toBeInstanceOf(Id);
    expect(sut.userId).toBeInstanceOf(Id);
  });
});
