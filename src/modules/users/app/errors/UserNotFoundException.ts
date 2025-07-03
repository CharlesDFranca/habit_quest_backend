import { AppError } from "@/shared/app/errors/AppError";
import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";

export class UserNotFoundException extends AppError {
  code = ErrorCodes.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}
