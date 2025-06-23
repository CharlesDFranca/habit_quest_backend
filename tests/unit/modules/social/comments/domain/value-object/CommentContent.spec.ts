import { CommentContent } from "@/modules/social/comments/domain/value-object/CommentContent";
import { describe, it, expect } from "vitest";

describe("CommentContent value-object unit tests", () => {
  const MAX_LENGTH = 300;
  const MIN_LENGTH_FOR_SUMMARY = 10;

  it("should create a CommentContent", () => {
    const sut = CommentContent.create({ value: "Comment content" });

    expect(sut).toBeDefined();
    expect(sut.value).toBe("Comment content");
  });

  it.each(["", "   "])(
    "should throw an error if content is empty",
    (content) => {
      expect(() => CommentContent.create({ value: content })).toThrowError(
        "Comment content cannot be empty",
      );
    },
  );

  it(`should throw an error if content length is greater than: ${MAX_LENGTH}`, () => {
    expect(() =>
      CommentContent.create({ value: "A".repeat(MAX_LENGTH + 1) }),
    ).toThrowError(`Comment content cannot be too long. [MAX: ${MAX_LENGTH}]`);
  });

  it("should return a summary of content with 50 characters", () => {
    const SUMMARY_LENGTH = 50;
    const contentWithMaxLength = "A".repeat(MAX_LENGTH);

    const sut = CommentContent.create({ value: contentWithMaxLength });

    const summary = sut.summary();

    expect(summary.length).toBe(SUMMARY_LENGTH);
  });

  it("should return a summary of content with 30 characters", () => {
    const SUMMARY_LENGTH = 30;
    const contentWithMaxLength = "A".repeat(MAX_LENGTH);

    const sut = CommentContent.create({ value: contentWithMaxLength });

    const summary = sut.summary(SUMMARY_LENGTH);

    expect(summary.length).toBe(SUMMARY_LENGTH);
  });

  it(`should return an error if summary length is less than ${MIN_LENGTH_FOR_SUMMARY}`, () => {
    const contentWithMaxLength = "A".repeat(MAX_LENGTH);

    const sut = CommentContent.create({ value: contentWithMaxLength });

    expect(() => sut.summary(MIN_LENGTH_FOR_SUMMARY - 1)).toThrowError(
      `The maximum length must be at least ${MIN_LENGTH_FOR_SUMMARY} to allow for a meaningful summary`,
    );
  });

  it.each(["content  ", "   content    ", "content  "])(
    "should trim content before saving",
    (content) => {
      const sut = CommentContent.create({ value: content });

      expect(sut.value).toBe(content.trim());
    },
  );
});
