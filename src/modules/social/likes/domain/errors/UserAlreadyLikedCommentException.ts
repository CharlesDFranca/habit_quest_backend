import { DomainError } from "@/shared/domain/errors/DomainError";
import { ErrorCodes } from "@/shared/errors/enums/codes";

export class UserAlreadyLikedCommentException extends DomainError {
  code = ErrorCodes.ALREADY_LIKED;

  constructor(message: string) {
    super(message);
  }
}
