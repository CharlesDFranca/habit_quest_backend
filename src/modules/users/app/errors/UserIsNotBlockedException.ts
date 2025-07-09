import { AppError } from "@/shared/app/errors/AppError";
import { Id } from "@/shared/domain/value-objects/Id";
import { ErrorCodes } from "@/shared/errors/enums/codes";

type IsNotBlockedDetails = {
  userId: string;
};

export class UserIsNotBlockedException extends AppError {
  code = ErrorCodes.USER_IS_NOT_BLOCKED;
  details: IsNotBlockedDetails;

  constructor(blockedId: Id<"UserId">) {
    super(`User is not blocked`);
    this.details = { userId: blockedId.value };
  }
}
