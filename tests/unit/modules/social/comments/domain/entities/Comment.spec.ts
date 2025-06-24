import { Comment } from "@/modules/social/comments/domain/entities/Comment";
import { CommentContent } from "@/modules/social/comments/domain/value-object/CommentContent";
import { Id } from "@/shared/domain/value-objects/Id";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const makeComment = (createdAt?: Date, updatedAt?: Date) =>
  Comment.create({
    authorId: Id.generate<"UserId">(),
    postId: Id.generate<"PostId">(),
    likeIds: [],
    replyIds: [],
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
      expect(sut.likeIds).toBeInstanceOf(Array);
      expect(sut.replyIds).toBeInstanceOf(Array);
      expect(sut.content.value).toBe("Comment content");
    });

    it("should return likeIds safely (immutable array)", () => {
      const likes = sut.likeIds;

      expect(Array.isArray(likes)).toBeTruthy();

      likes.push(Id.generate<"LikeId">());

      expect(sut.likeIds.length).toBe(0);
    });

    it("should return replyIds safely (immutable array)", () => {
      const replys = sut.replyIds;

      expect(Array.isArray(replys)).toBeTruthy();

      replys.push(Id.generate<"CommentId">());

      expect(sut.likeIds.length).toBe(0);
    });
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
      const likeId = Id.generate<"LikeId">();

      vi.advanceTimersByTime(10);
      sut.addLikeId(likeId);

      expect(sut.likeIds).toContain(likeId);
      expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it("shouldn't add a like if it exists", () => {
      const oldUpdatedAt = sut.updatedAt;
      const likeId = Id.generate<"LikeId">();

      vi.advanceTimersByTime(10);
      sut.addLikeId(likeId);

      expect(sut.likeIds.length).toBe(1);
      expect(sut.likeIds).toContain(likeId);
      expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());

      const newOldUpdatedAt = sut.updatedAt;

      vi.advanceTimersByTime(10);
      sut.addLikeId(likeId);

      expect(sut.likeIds.length).toBe(1);
      expect(sut.updatedAt.getTime()).not.toBeGreaterThan(
        newOldUpdatedAt.getTime(),
      );
    });

    it("should remove a like if it exists", () => {
      const oldUpdatedAt = sut.updatedAt;
      const likeId = Id.generate<"LikeId">();

      sut.addLikeId(likeId);
      vi.advanceTimersByTime(10);
      sut.removeLikeId(likeId);

      expect(sut.likeIds).not.toContain(likeId);
      expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it("shouldn't update updatedAt when removing a non-existent like", () => {
      const oldUpdatedAt = sut.updatedAt;
      const likeId = Id.generate<"LikeId">();

      vi.advanceTimersByTime(10);
      sut.removeLikeId(likeId);

      expect(sut.updatedAt.getTime()).not.toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );
    });
  });

  describe("Reply", () => {
    it("should add a reply if no exists", () => {
      const oldUpdatedAt = sut.updatedAt;
      const replyId = Id.generate<"CommentId">();

      vi.advanceTimersByTime(10);
      sut.addReplyId(replyId);

      expect(sut.replyIds).toContain(replyId);
      expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it("shouldn't add a reply if it exists", () => {
      const oldUpdatedAt = sut.updatedAt;
      const replyId = Id.generate<"CommentId">();

      vi.advanceTimersByTime(10);
      sut.addReplyId(replyId);

      expect(sut.replyIds.length).toBe(1);
      expect(sut.replyIds).toContain(replyId);
      expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());

      vi.advanceTimersByTime(10);
      sut.addReplyId(replyId);

      const newOldUpdatedAt = sut.updatedAt;

      expect(sut.replyIds.length).toBe(1);
      expect(sut.updatedAt.getTime()).not.toBeGreaterThan(
        newOldUpdatedAt.getTime(),
      );
    });

    it("should remove a reply if it exists", () => {
      const oldUpdatedAt = sut.updatedAt;
      const replyId = Id.generate<"CommentId">();

      sut.addReplyId(replyId);
      vi.advanceTimersByTime(10);
      sut.removeReplyId(replyId);

      expect(sut.replyIds).not.toContain(replyId);
      expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });

    it("shouldn't update updatedAt when removing a non-existent reply", () => {
      const oldUpdatedAt = sut.updatedAt;
      const replyId = Id.generate<"CommentId">();

      vi.advanceTimersByTime(10);
      sut.removeReplyId(replyId);

      expect(sut.updatedAt.getTime()).not.toBeGreaterThan(
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
      const shortContent = CommentContent.create({ value: "Short content" });

      sut.updateContent(shortContent);
      expect(sut.contentSummary()).toBe("Short content");
    });
  });
});
