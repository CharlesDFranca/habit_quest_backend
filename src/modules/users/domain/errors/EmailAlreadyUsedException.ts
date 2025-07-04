import { DomainError } from "@/shared/domain/errors/DomainError";
import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";
import { Email } from "../value-objects/Email";

export class EmailAlreadyUsedException extends DomainError {
  code = ErrorCodes.EMAIL_ALREADY_USED;

  constructor(email: Email) {
    super(`Email already used: ${email.value}`);
  }
}
