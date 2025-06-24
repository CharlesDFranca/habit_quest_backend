import { Comment } from "@/modules/social/comments/domain/entities/Comment";
import { CommentContent } from "@/modules/social/comments/domain/value-object/CommentContent";
import { Id } from "@/shared/domain/value-objects/Id";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const makeComment = (createdAt?: Date, updatedAt?: Date) =>
  Comment.create({
    authorId: Id.generate<"UserId">(),
    postId: Id.generate<"PostId">(),
    likeCount: 0,
    replyCount: 0,
    content: CommentContent.create({ value: "Comment content" }),
    createdAt: createdAt ?? new Date(),
    updatedAt: updatedAt ?? createdAt ?? new Date(),
  });

describe("Comment entity unit tests", () => {
  let sut: Comment;

  beforeEach(() => {
    sut = makeComment();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getters", () => {
    it("should expose getters correctly", () => {
      expect(sut.id).toBeInstanceOf(Id);
      expect(sut.authorId).toBeInstanceOf(Id);
      expect(sut.postId).toBeInstanceOf(Id);
      expect(sut.likeCount).toBe(0);
      expect(sut.likeCount).toBe(0);
      expect(sut.content.value).toBe("Comment content");
    });

    describe("Content", () => {
      it("should update content and touch updatedAt", () => {
        const oldUpdatedAt = sut.updatedAt;

        vi.advanceTimersByTime(10);

        const updatedContent = CommentContent.create({
          value: "Updated content",
        });

        sut.updateContent(updatedContent);

        expect(sut.content).toBe(updatedContent);
        expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
      });
    });

    describe("Likes", () => {
      it("should add a like if no exists", () => {
        const oldUpdatedAt = sut.updatedAt;

        vi.advanceTimersByTime(10);
        sut.addLikeId();

        expect(sut.likeCount).toBe(1);
        expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
      });

      it("should remove a like if it exists", () => {
        const oldUpdatedAt = sut.updatedAt;

        sut.addLikeId();
        expect(sut.likeCount).toBe(1);
        vi.advanceTimersByTime(10);
        sut.removeLikeId();

        expect(sut.likeCount).toBe(0);
        expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
      });

      describe("Reply", () => {
        it("should add a reply if no exists", () => {
          const oldUpdatedAt = sut.updatedAt;

          vi.advanceTimersByTime(10);
          sut.addReplyId();

          expect(sut.replyCount).toBe(1);
          expect(sut.updatedAt.getTime()).toBeGreaterThan(
            oldUpdatedAt.getTime(),
          );
        });

        it("should remove a reply if it exists", () => {
          const oldUpdatedAt = sut.updatedAt;

          sut.addReplyId();
          expect(sut.replyCount).toBe(1);
          vi.advanceTimersByTime(10);
          sut.removeReplyId();

          expect(sut.replyCount).toBe(0);
          expect(sut.updatedAt.getTime()).toBeGreaterThan(
            oldUpdatedAt.getTime(),
          );
        });
      });

      describe("CreatedAt and UpdatedAt", () => {
        it("should create a Comment with createdAt", () => {
          const createdAt = new Date();
          vi.advanceTimersByTime(1000);
          const updatedAt = new Date();

          const sut = makeComment(createdAt, updatedAt);

          expect(sut.createdAt.getTime()).toBe(createdAt.getTime());
          expect(sut.updatedAt.getTime()).toBe(updatedAt.getTime());
        });
      });

      describe("Summary", () => {
        it("should return full content if smaller than maxLength", () => {
          const shortContent = CommentContent.create({
            value: "Short content",
          });

          sut.updateContent(shortContent);
          expect(sut.contentSummary()).toBe("Short content");
        });
      });
    });
  });
});
