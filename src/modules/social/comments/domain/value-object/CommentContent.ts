import { ValueObject } from "@/shared/domain/value-objects/ValueObject";

type CommentContentProps = { value: string };

export class CommentContent extends ValueObject<CommentContentProps> {
  static create(props: CommentContentProps): CommentContent {
    const content = props.value.trim();

    return new CommentContent({ value: content });
  }

  protected validate(props: CommentContentProps): boolean {
    const MAX_LENGTH = 300;
    const content = props.value;

    if (content.length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    if (content.length > MAX_LENGTH) {
      throw new Error(
        `Comment content cannot be too long. [MAX: ${MAX_LENGTH}]`,
      );
    }

    return true;
  }

  summary(maxLength: number = 50): string {
    const MIN_LENGTH_FOR_SUMMARY = 10;

    if (maxLength < MIN_LENGTH_FOR_SUMMARY) {
      throw new Error(
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
