import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { Id } from "@/shared/domain/value-objects/Id";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { PostContent } from "@/modules/social/posts/domain/value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";

const makePost = (createAt?: Date, updatedAt?: Date) => {
  return new (class extends Post {
    constructor() {
      super(Id.generate<"PostId">(), {
        authorId: Id.generate<"UserId">(),
        commentIds: [],
        likeIds: [],
        content: PostContent.create({ value: "Initial content" }),
        images: [],
        createdAt: createAt ?? new Date(),
        updatedAt: updatedAt ?? createAt ?? new Date(),
      });
    }
  })();
};

describe("Post entity unit tests", () => {
  let sut: Post;

  beforeEach(() => {
    sut = makePost();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should expose getters correctly", () => {
    expect(sut.id).toBeInstanceOf(Id);
    expect(sut.authorId).toBeInstanceOf(Id);
    expect(sut.content.value).toBe("Initial content");
    expect(sut.commentIds).toBeInstanceOf(Array<Id<"CommentId">>);
    expect(sut.likeIds).toBeInstanceOf(Array<Id<"LikeId">>);
    expect(sut.images).toBeInstanceOf(Array<ImageUrl>);
  });

  it("should return commentIds safely (immutable array)", () => {
    const comments = sut.commentIds;

    expect(Array.isArray(comments)).toBeTruthy();

    comments.push(Id.generate<"CommentId">());

    expect(sut.commentIds.length).toBe(0);
  });

  it("should return likeIds safely (immutable array)", () => {
    const likes = sut.likeIds;

    expect(Array.isArray(likes)).toBeTruthy();

    likes.push(Id.generate<"LikeId">());

    expect(sut.likeIds.length).toBe(0);
  });

  it("should return images safely (immutable array)", () => {
    const images = sut.images;

    expect(Array.isArray(images)).toBeTruthy();

    const newImage = ImageUrl.create({ value: "new-image.png" });

    images.push(newImage);

    expect(sut.images.length).toBe(0);
  });

  it("should update content and touch updatedAt", () => {
    const oldUpdatedAt = sut.updatedAt;

    vi.advanceTimersByTime(10);

    const updatedContent = PostContent.create({ value: "Updated content" });

    sut.updateContent(updatedContent);

    expect(sut.content).toBe(updatedContent);
    expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should add image and update updatedAt", () => {
    const oldUpdatedAt = sut.updatedAt;

    vi.advanceTimersByTime(10);
    const newImage = ImageUrl.create({ value: "image1.png" });
    sut.addImage(newImage);

    expect(sut.images).toContain(newImage);
    expect(sut.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("should not allow more than 5 images", () => {
    ImageUrl.create({ value: "img1.png" });
    sut.addImage(ImageUrl.create({ value: "img1.png" }));
    sut.addImage(ImageUrl.create({ value: "img2.png" }));
    sut.addImage(ImageUrl.create({ value: "img3.png" }));
    sut.addImage(ImageUrl.create({ value: "img4.png" }));
    sut.addImage(ImageUrl.create({ value: "img5.png" }));

    expect(() =>
      sut.addImage(ImageUrl.create({ value: "img6.png" })),
    ).toThrowError("It is not possible to add more images");
  });

  it("should remove an existing image", () => {
    const image = ImageUrl.create({ value: "img1.png" });
    sut.addImage(image);
    sut.removeImage(image);

    expect(sut.images.includes(image)).toBe(false);
  });

  it("should do nothing if image does not exist", () => {
    const beforeImages = sut.images;

    const nonexistent = ImageUrl.create({ value: "nonexistent.png" });

    sut.removeImage(nonexistent);

    expect(sut.images).toEqual(beforeImages);
  });

  it("should return full content if smaller than maxLength", () => {
    const shortContent = PostContent.create({ value: "Short content" });

    sut.updateContent(shortContent);
    expect(sut.contentSummary()).toBe("Short content...");
  });

  it("should throw error if maxLength is too small", () => {
    const MIN_LENGTH_FOR_SUMMARY = 10;

    expect(() => sut.contentSummary(5)).toThrowError(
      `The maximum length must be at least ${MIN_LENGTH_FOR_SUMMARY} to allow for a meaningful summary`,
    );
  });

  it("should return trimmed summary with dots if content is larger", () => {
    const longContent = PostContent.create({
      value: "This is a very long content for testing summary behavior.",
    });

    sut.updateContent(longContent);

    const summary = sut.contentSummary(20);

    expect(summary.endsWith("...")).toBeTruthy();
    expect(summary.length).toBeLessThanOrEqual(20);
  });

  it("should return 'Right now' for very recent sut", () => {
    expect(sut.getElapsedTimeSinceCreation()).toBe("Right now");
  });

  it("should return minutes ago", () => {
    const sut = makePost(new Date(Date.now() - 5 * 60 * 1000));
    expect(sut.getElapsedTimeSinceCreation()).toBe("5 minutes ago");
  });

  it("should return hours ago", () => {
    const sut = makePost(new Date(Date.now() - 2 * 60 * 60 * 1000));

    expect(sut.getElapsedTimeSinceCreation()).toBe("2 hours ago");
  });

  it("should return days ago", () => {
    const sut = makePost(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));

    expect(sut.getElapsedTimeSinceCreation()).toBe("3 days ago");
  });

  it("should return years ago", () => {
    const sut = makePost(new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000));

    expect(sut.getElapsedTimeSinceCreation()).toBe("2 years ago");
  });
});
