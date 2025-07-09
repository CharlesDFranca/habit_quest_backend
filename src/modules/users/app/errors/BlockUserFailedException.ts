import { AppError } from "@/shared/app/errors/AppError";
import { ErrorCodes } from "@/shared/errors/enums/codes";
import { Id } from "@/shared/domain/value-objects/Id";

export class BlockUserFailedException extends AppError {
  code = ErrorCodes.BLOCK_USER_FAILED;

  constructor(id: Id<"BlockedUserId">) {
    super(`Could not complete the block operation for user ${id.value}.`);
  }
}
