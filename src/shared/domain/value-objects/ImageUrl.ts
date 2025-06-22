import { ValueObject } from "@/shared/domain/value-objects/ValueObject";

type ImageUrlProps = { value: string };

export class ImageUrl extends ValueObject<ImageUrlProps> {
  static create(props: ImageUrlProps): ImageUrl {
    const url = props.value.trim();

    return new ImageUrl({ value: url });
  }

  protected validate(props: ImageUrlProps): boolean {
    const url = props.value;

    if (url.length === 0) {
      throw new Error("Image url cannot be empty");
    }

    const validExtensions = [".jpg", ".png", ".webp", ".jpeg"];

    const isValid = validExtensions.some((extension) =>
      url.toLocaleLowerCase().endsWith(extension),
    );

    if (!isValid) {
      throw new Error(`Invalid image extension.\nImage url: ${url}`);
    }

    const baseName = url.substring(0, url.lastIndexOf("."));

    if (baseName.trim().length === 0) {
      throw new Error("Image URL must contain a filename before the extension");
    }

    return true;
  }

  get value(): string {
    return this.props.value;
  }
}
