import { Like } from "@/modules/social/likes/domain/entities/Like";
import { Id } from "@/shared/domain/value-objects/Id";
import { describe, it, expect } from "vitest";

class StubLike extends Like {
  constructor() {
    super(Id.generate<"LikeId">(), { userId: Id.generate<"UserId">() });
  }
}

describe("Like entity unit tests", () => {
  const sut: Like = new StubLike();

  it("should expose getters correctly", () => {
    expect(sut.id).toBeDefined();
    expect(sut.userId).toBeDefined();

    expect(sut.id).toBeInstanceOf(Id);
    expect(sut.userId).toBeInstanceOf(Id);
  });
});
