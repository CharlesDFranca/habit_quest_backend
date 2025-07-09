import { AppError } from "@/shared/app/errors/AppError";
import { ErrorCodes } from "@/shared/errors/enums/codes";
import { Id } from "@/shared/domain/value-objects/Id";

export class UserAlreadyBlockedException extends AppError {
  code = ErrorCodes.USER_ALREADY_BLOCKED;

  constructor(userId: Id<"UserId">) {
    super(`User already blocked: ${userId.value}`);
  }
}
