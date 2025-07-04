import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";
import { DomainError } from "./DomainError";

export class InvalidValueObjectException extends DomainError {
  code = ErrorCodes.INVALID_VALUE_OBJECT;

  constructor(message: string) {
    super(message);
  }
}
