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
        commentCount: 0,
        likeCount: 0,
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
    expect(sut.commentCount).toBe(0);
    expect(sut.likeCount).toBe(0);
    expect(sut.images).toBeInstanceOf(Array<ImageUrl>);
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
    expect(sut.contentSummary()).toBe("Short content");
  });

  it("should throw error if maxLength is too small", () => {
    const MIN_LENGTH_FOR_SUMMARY = 10;

    expect(() => sut.contentSummary(5)).toThrowError(
      `The maximum length must be at least ${MIN_LENGTH_FOR_SUMMARY} to allow for a meaningful summary`,
    );
  });

  it("should return trimmed summary if content is larger", () => {
    const longContent = PostContent.create({
      value: "This is a very long content for testing summary behavior.",
    });

    sut.updateContent(longContent);

    const summary = sut.contentSummary(20);

    expect(summary.length).toBeLessThanOrEqual(20);
  });
});
