import { PostContent } from "@/modules/social/posts/domain/value-objects/PostContent";
import { describe, it, expect } from "vitest";

describe("PostContent value-object unit tests", () => {
  const MAX_LENGTH = 2500;
  const MIN_LENGTH_FOR_SUMMARY = 10;

  it("should create a PostContent", () => {
    const content = "Post Content";
    const sut = PostContent.create({ value: content });

    expect(sut).toBeDefined();
    expect(sut.value).toBe(content);
  });

  it(`should create a PostContent with exactly ${MAX_LENGTH} characters`, () => {
    const content = "A".repeat(MAX_LENGTH);
    const sut = PostContent.create({ value: content });
    expect(sut.value).toBe(content);
  });

  it(`should throw an error if content is greatter than ${MAX_LENGTH} characters`, () => {
    expect(() =>
      PostContent.create({ value: "A".repeat(MAX_LENGTH + 1) }),
    ).toThrowError(`Post content cannot be too long. [MAX: ${MAX_LENGTH}]`);
  });

  it.each(["", "     "])(
    "should throw an error if content is empty. '%s'",
    (content) => {
      expect(() => PostContent.create({ value: content })).toThrowError(
        "Post content cannot be empty",
      );
    },
  );

  it("should return a summary of content with 200 characters", () => {
    const SUMMARY_LENGTH = 200;
    const contentWithMaxLength = "A".repeat(MAX_LENGTH);

    const sut = PostContent.create({ value: contentWithMaxLength });

    const summary = sut.summary();

    expect(summary.length).toBe(SUMMARY_LENGTH);
  });

  it("should return a summary of content with 50 characters", () => {
    const SUMMARY_LENGTH = 50;
    const contentWithMaxLength = "A".repeat(MAX_LENGTH);

    const sut = PostContent.create({ value: contentWithMaxLength });

    const summary = sut.summary(SUMMARY_LENGTH);

    expect(summary.length).toBe(SUMMARY_LENGTH);
  });

  it(`should return an error if summary length is less than ${MIN_LENGTH_FOR_SUMMARY}`, () => {
    const contentWithMaxLength = "A".repeat(MAX_LENGTH);

    const sut = PostContent.create({ value: contentWithMaxLength });

    expect(() => sut.summary(MIN_LENGTH_FOR_SUMMARY - 1)).toThrowError(
      `The maximum length must be at least ${MIN_LENGTH_FOR_SUMMARY} to allow for a meaningful summary`,
    );
  });

  it.each(["content  ", "  content", "content  "])(
    "should trim content before saving",
    (content) => {
      const sut = PostContent.create({ value: content });

      expect(sut.value).toBe(content.trim());
    },
  );
});
