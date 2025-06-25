import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { Id } from "@/shared/domain/value-objects/Id";
import { Post } from "@/modules/social/posts/domain/entities/Post";
import { PostContent } from "@/modules/social/posts/domain/value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { Counter } from "@/shared/domain/value-objects/Counter";

const makePost = (createAt?: Date, updatedAt?: Date) => {
  return Post.create(
    {
      authorId: Id.generate<"UserId">(),
      content: PostContent.create({ value: "Initial content" }),
      commentCount: Counter.create({ value: 0 }),
      likeCount: Counter.create({ value: 0 }),
      images: [],
      createdAt: createAt ?? new Date(),
      updatedAt: updatedAt ?? createAt ?? new Date(),
    },
    Id.generate<"PostId">(),
  );
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
    expect(sut.commentCount.value).toBe(0);
    expect(sut.likeCount.value).toBe(0);
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

  it("shouldn't update content if is the same", () => {
    const currentContent = sut.content;
    const oulUpdatedAt = sut.updatedAt;

    sut.updateContent(currentContent);

    expect(sut.content).toBe(currentContent);
    expect(sut.updatedAt.getTime()).toBe(oulUpdatedAt.getTime());
  });

  it("should increment likeCount by one", () => {
    expect(sut.likeCount.value).toBe(0);

    sut.increaseLikeCount();

    expect(sut.likeCount.value).toBe(1);
  });

  it("should increment likeCount by 10", () => {
    expect(sut.likeCount.value).toBe(0);

    sut.increaseLikeCount(10);

    expect(sut.likeCount.value).toBe(10);
  });

  it("should decrement likeCount by one", () => {
    sut.increaseLikeCount();

    expect(sut.likeCount.value).toBe(1);

    sut.decreaseLikeCount();

    expect(sut.likeCount.value).toBe(0);
  });

  it("should decrement likeCount by 5", () => {
    sut.increaseLikeCount(10);

    expect(sut.likeCount.value).toBe(10);

    sut.decreaseLikeCount(5);

    expect(sut.likeCount.value).toBe(5);
  });

  it("should throw an error if decrement amount greater than likeCount have", () => {
    sut.increaseLikeCount(10);

    expect(sut.likeCount.value).toBe(10);

    expect(() => sut.decreaseLikeCount(20)).toThrowError(
      "It is not possible to decrement if the value to be subtracted is greater than the current value of the counter",
    );
  });

  it("should decrement commentCount by one", () => {
    sut.increaseCommentCount();

    expect(sut.commentCount.value).toBe(1);

    sut.decreaseCommentCount();

    expect(sut.commentCount.value).toBe(0);
  });

  it("should decrement commentCount by 5", () => {
    sut.increaseCommentCount(10);

    expect(sut.commentCount.value).toBe(10);

    sut.decreaseCommentCount(5);

    expect(sut.commentCount.value).toBe(5);
  });

  it("should throw an error if decrement amount greater than commentCount have", () => {
    sut.increaseCommentCount(10);

    expect(sut.commentCount.value).toBe(10);

    expect(() => sut.decreaseCommentCount(20)).toThrowError();
  });
});
