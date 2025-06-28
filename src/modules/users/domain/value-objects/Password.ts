import { ValueObject } from "@/shared/domain/value-objects/ValueObject";

type PasswordProps = { value: string; isHashed?: boolean };

export class Password extends ValueObject<PasswordProps> {
  protected constructor(protected readonly props: PasswordProps) {
    super(props);
  }

  static create(props: PasswordProps): Password {
    const password = props.value.trim();

    return new Password({ value: password });
  }

  static createFromHash(props: PasswordProps): Password {
    return new Password({ value: props.value, isHashed: true });
  }

  protected validate(props: PasswordProps): boolean {
    const password = props.value;

    if (password.length === 0) {
      throw new Error("Password cannot be empty");
    }

    if (props.isHashed) return true;

    const MIN_LENGTH = 8;
    const MAX_LENGTH = 20;

    if (password.length < MIN_LENGTH) {
      throw new Error(`Password cannot be too short: [MIN: ${MIN_LENGTH}]`);
    }

    if (password.length > MAX_LENGTH) {
      throw new Error(`Password cannot be too long: [MAX: ${MAX_LENGTH}]`);
    }

    const hasLowercase = /[a-z]/;

    if (!hasLowercase.test(password)) {
      throw new Error("Password must have at least one lowercase letter");
    }

    const hasUppercase = /[A-Z]/;

    if (!hasUppercase.test(password)) {
      throw new Error("Password must have at least one uppercase letter");
    }

    const hasNumber = /\d/;

    if (!hasNumber.test(password)) {
      throw new Error("Password must have at least one number");
    }

    const hasSpecialChar = /[^a-zA-Z0-9]/;

    if (!hasSpecialChar.test(password)) {
      throw new Error("Password must have at least one special character");
    }

    return true;
  }

  get value(): string {
    return this.props.value;
  }
}
