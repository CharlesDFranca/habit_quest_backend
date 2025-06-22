import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { describe, it, expect } from "vitest";

describe("ImageUrl value-object unit tests", () => {
  it.each([
    "photo.jpg",
    "folder/image.webp",
    "example.test.png",
    "multi.part.name.jpeg",
    "IMAGE.JPG",
    "Photo.WEbP",
    "IMG.PNG",
    "file.JPEG",
  ])("should create a valid ImageUrl with extension : '%s'", (url) => {
    const sut = ImageUrl.create({ value: url });

    expect(sut).toBeDefined();
    expect(sut.value).toBe(url.trim());
  });

  it.each([
    "image",
    "photo.",
    "filejpg",
    "folder/imagejpg",
    "image.jp",
    "image.web",
    "image.gif",
    "image.mp4",
    "image.mp3",
  ])("should throw an error for invalid extension: '%s'", (url) => {
    expect(() => ImageUrl.create({ value: url })).toThrowError(
      `Invalid image extension.\nImage url: ${url}`,
    );
  });

  it.each([".jpg", ".png", ".jpeg", ".webp", " .jpg", " .png "])(
    "should throw an error if url has no name before extension: '%s'",
    (url) => {
      expect(() => ImageUrl.create({ value: url.trim() })).toThrowError(
        "Image URL must contain a filename before the extension",
      );
    },
  );

  it.each(["", "   "])("should throw an error if url is empty: '%s'", (url) => {
    expect(() => ImageUrl.create({ value: url })).toThrowError(
      "Image url cannot be empty",
    );
  });

  it.each(["   image.jpg   ", "   test.png", "photo.webp   "])(
    "should trim spaces from url: '%s'",
    (url) => {
      const sut = ImageUrl.create({ value: url });

      expect(sut.value).toBe(url.trim());
    },
  );
});
