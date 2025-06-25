import { describe, it, expect } from "vitest";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { PostDomainService } from "@/modules/social/posts/domain/services/PostDomainService";
import { Id } from "@/shared/domain/value-objects/Id";
import { PostContent } from "@/modules/social/posts/domain/value-objects/PostContent";
import { Counter } from "@/shared/domain/value-objects/Counter";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";

const makePost = ({
  id = Id.generate<"PostId">(),
  likeCount = 0,
  commentCount = 0,
  isPinned = false,
  isPrivate = false,
  createdAt = new Date(),
}: Partial<{
  id: Id<"PostId">;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isPrivate: boolean;
  createdAt: Date;
}> = {}): Post =>
  Post.create(
    {
      authorId: Id.generate<"UserId">(),
      likeCount: Counter.create({ value: likeCount }),
      commentCount: Counter.create({ value: commentCount }),
      content: PostContent.create({ value: "Sample content" }),
      images: [ImageUrl.create({ value: "https://example.com/image.jpg" })],
      isPinned,
      isPrivate,
      createdAt,
    },
    id,
  );

describe("PostDomainService", () => {
  it("should return only pinned posts", () => {
    const posts = [
      makePost({ isPinned: true }),
      makePost({ isPinned: false }),
      makePost({ isPinned: true }),
    ];

    const result = PostDomainService.getPinnedPosts(posts);
    expect(result.length).toBe(2);
    expect(result.every((post) => post.isPinned)).toBe(true);
  });

  it("should return only public posts", () => {
    const posts = [
      makePost({ isPrivate: false }),
      makePost({ isPrivate: true }),
      makePost({ isPrivate: false }),
    ];

    const result = PostDomainService.getPublicPosts(posts);
    expect(result.length).toBe(2);
    expect(result.every((post) => post.isPrivate === false)).toBe(true);
  });

  it("should sort posts by most likes descending", () => {
    const post1 = makePost({ likeCount: 10 });
    const post2 = makePost({ likeCount: 20 });
    const post3 = makePost({ likeCount: 5 });

    const posts = [post1, post2, post3];

    const result = PostDomainService.sortPostsByMostLikes(posts);
    expect(result).toEqual([post2, post1, post3]);
  });

  it("should sort posts by createdAt descending", () => {
    const now = new Date();
    const post1 = makePost({ createdAt: new Date(now.getTime() - 1000) });
    const post2 = makePost({ createdAt: new Date(now.getTime() - 5000) });
    const post3 = makePost({ createdAt: now });

    const posts = [post1, post2, post3];

    const result = PostDomainService.sortPostsByCreatedAt(posts);
    expect(result).toEqual([post3, post1, post2]);
  });
});
