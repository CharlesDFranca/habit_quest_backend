import { InvalidValueObjectException } from "@/shared/domain/erros/InvalidValueObjectException";
import { ValueObject } from "@/shared/domain/value-objects/ValueObject";

type PostContentProps = { value: string };

export class PostContent extends ValueObject<PostContentProps> {
  static create(props: PostContentProps): PostContent {
    const content = props.value.trim();

    return new PostContent({ value: content });
  }

  protected validate(props: PostContentProps): boolean {
    const MAX_LENGTH = 2500;
    const content = props.value;

    if (content.length === 0) {
      throw new InvalidValueObjectException("Post content cannot be empty");
    }

    if (content.length > MAX_LENGTH) {
      throw new InvalidValueObjectException(
        `Post content cannot be too long. [MAX: ${MAX_LENGTH}]`,
      );
    }

    return true;
  }

  summary(maxLength: number = 200): string {
    const MIN_LENGTH_FOR_SUMMARY = 10;

    if (maxLength < MIN_LENGTH_FOR_SUMMARY) {
      throw new InvalidValueObjectException(
        `The maximum length must be at least ${MIN_LENGTH_FOR_SUMMARY} to allow for a meaningful summary`,
      );
    }

    const content = this.value.trim();

    return content.length <= maxLength
      ? content
      : content.substring(0, maxLength);
  }

  get value(): string {
    return this.props.value;
  }
}
