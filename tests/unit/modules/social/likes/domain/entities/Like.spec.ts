import { Like } from "@/modules/social/likes/domain/entities/Like";
import { Id } from "@/shared/domain/value-objects/Id";
import { describe, it, expect, beforeEach } from "vitest";

const makeLike = (createdAt?: Date, updatedAt?: Date) =>
  Like.create(
    {
      userId: Id.generate<"UserId">(),
      likeableId: Id.generate<"PostId">(),
      likeableType: "Post",
      createdAt: createdAt ?? new Date(),
      updatedAt: updatedAt ?? createdAt ?? new Date(),
    },
    Id.generate<"LikeId">(),
  );

describe("Like entity unit tests", () => {
  let sut: Like;

  beforeEach(() => {
    sut = makeLike();
  });

  it("should expose getters correctly", () => {
    expect(sut.id).toBeDefined();
    expect(sut.userId).toBeDefined();
    expect(sut.likeableId).toBeDefined();

    expect(sut.id).toBeInstanceOf(Id);
    expect(sut.userId).toBeInstanceOf(Id);
    expect(sut.likeableId).toBeInstanceOf(Id);
    
    expect(sut.likeableType).toBe("Post");
  });
});
