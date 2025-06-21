import { ValueObject } from "@/shared/domain/value-objects/ValueObject";

type AliasProps = { value: string };

export class Alias extends ValueObject<AliasProps> {
  protected constructor(protected readonly props: AliasProps) {
    super(props);
  }

  static create(props: AliasProps): Alias {
    return new Alias({ value: props.value });
  }

  protected validate(props: AliasProps): boolean {
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 20;

    const allowedCharsRegex = /^[a-zA-Z0-9._\-@!?]+$/;
    const startsWithValidCharRegex = /^[a-zA-Z0-9]/;
    const hasAtLeastOneAlphanumeric = /[a-zA-Z0-9]/;

    const alias = props.value.trim();

    if (alias.length === 0) {
      throw new Error("Alias cannot be empty");
    }

    if (alias.length < MIN_LENGTH) {
      throw new Error(`Alias cannot be too short. [MIN: ${MIN_LENGTH}]`);
    }

    if (alias.length > MAX_LENGTH) {
      throw new Error(`Alias cannot be too long. [MAX: ${MAX_LENGTH}]`);
    }

    if (!allowedCharsRegex.test(alias)) {
      throw new Error(
        `Alias contains invalid characters. Allowed: letters, numbers, . _ - @ ! ?.\nInvalid Alias: ${alias}`,
      );
    }

    if (!hasAtLeastOneAlphanumeric.test(alias)) {
      throw new Error(
        `Alias must contain at least one letter or number.\nInvalid Alias: ${alias}`,
      );
    }

    if (!startsWithValidCharRegex.test(alias)) {
      throw new Error(
        `Alias cannot start with a special character.\nInvalid Alias: ${alias}`,
      );
    }

    if (!isNaN(Number(alias))) {
      throw new Error("Alias cannot be entirely numeric");
    }

    return true;
  }

  get value(): string {
    return this.props.value;
  }
}
