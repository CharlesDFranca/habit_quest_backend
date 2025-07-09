import { DomainError } from "@/shared/domain/errors/DomainError";
import { ErrorCodes } from "@/shared/errors/enums/codes";

export class CannotBlockYourselfException extends DomainError {
  code = ErrorCodes.CANNOT_BLOCK_YOURSELF;

  constructor() {
    super("You cannot block yourself");
  }
}
