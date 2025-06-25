import { Id } from "@/shared/domain/value-objects/Id";
import { describe, it, expect } from "vitest";
import { Comment } from "@/modules/social/comments/domain/entities/Comment";
import { Counter } from "@/shared/domain/value-objects/Counter";
import { CommentContent } from "@/modules/social/comments/domain/value-object/CommentContent";
import { CommentDomainService } from "@/modules/social/comments/domain/services/CommentDomainService";

const makeComment = ({
  likeCount = 0,
  replyCount = 0,
  createdAt = new Date(),
}: Partial<{
  likeCount: number;
  replyCount: number;
  isPinned: boolean;
  isPrivate: boolean;
  createdAt: Date;
}> = {}): Comment =>
  Comment.create({
    authorId: Id.generate<"UserId">(),
    postId: Id.generate<"PostId">(),
    likeCount: Counter.create({ value: likeCount }),
    replyCount: Counter.create({ value: replyCount }),
    content: CommentContent.create({ value: "Sample content" }),
    createdAt,
  });

describe("CommentDomainService unit tests", () => {
  it("should return comment with most likes", () => {
    const comment1 = makeComment({ likeCount: 10 });
    const comment2 = makeComment({ likeCount: 6 });
    const comment3 = makeComment({ likeCount: 12 });

    const comments = [comment1, comment2, comment3];

    const mostLikedComment =
      CommentDomainService.getCommentWithMostLikes(comments);

    expect(mostLikedComment).toBe(comment3);
  });

  it("should return null if comments arrays is empty", () => {
    const comments: Comment[] = [];

    const mostLikedComment =
      CommentDomainService.getCommentWithMostLikes(comments);

    expect(mostLikedComment).toBeNull();
  });
});
