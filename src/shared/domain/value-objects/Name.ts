import { ValueObject } from "@/shared/domain/value-objects/ValueObject";
import { InvalidValueObjectException } from "../errors/InvalidValueObjectException";

type NameProps = { value: string };

export class Name extends ValueObject<NameProps> {
  protected constructor(protected readonly props: NameProps) {
    super(props);
  }

  static create(props: NameProps): Name {
    return new Name({ value: props.value });
  }

  protected validate(props: NameProps): boolean {
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 20;

    const name = props.value.trim();

    if (name.length === 0) {
      throw new InvalidValueObjectException("Name cannot be empty");
    }

    if (name.length < MIN_LENGTH) {
      throw new InvalidValueObjectException(
        `Name cannot be too short. [MIN: ${MIN_LENGTH}]`,
      );
    }

    if (name.length > MAX_LENGTH) {
      throw new InvalidValueObjectException(
        `Name cannot be too long. [MAX: ${MAX_LENGTH}]`,
      );
    }

    if (!isNaN(Number(name))) {
      throw new InvalidValueObjectException("Name cannot be entirely numeric");
    }

    return true;
  }

  get value(): string {
    return this.props.value;
  }
}
