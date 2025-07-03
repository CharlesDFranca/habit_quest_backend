import { InvalidValueObjectException } from "@/shared/domain/erros/InvalidValueObjectException";
import { ValueObject } from "@/shared/domain/value-objects/ValueObject";

type EmailProps = { value: string };

export class Email extends ValueObject<EmailProps> {
  protected constructor(protected readonly props: EmailProps) {
    super(props);
  }

  static create(props: EmailProps): Email {
    const email = props.value.trim().toLocaleLowerCase();

    return new Email({ value: email });
  }

  protected validate(props: EmailProps): boolean {
    const email = props.value;

    if (email.trim().length === 0) {
      throw new InvalidValueObjectException("Email cannot be empty");
    }

    if (email.includes("..")) {
      throw new InvalidValueObjectException(
        `Email cannot contain consecutive dots: ${email}`,
      );
    }

    const EMAIL_REGEX =
      /^(?!.*\.\.)(?!\.)([a-zA-Z0-9._%+-]*[a-zA-Z0-9_%+-])@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

    if (!EMAIL_REGEX.test(email)) {
      throw new InvalidValueObjectException(`Invalid email format: ${email}`);
    }

    return true;
  }

  get value(): string {
    return this.props.value;
  }
}
