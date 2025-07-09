import { AppError } from "@/shared/app/errors/AppError";
import { ErrorCodes } from "@/shared/errors/enums/codes";

export class InvalidCredentialsException extends AppError {
  code = ErrorCodes.INVALID_CREDENTIALS;

  constructor() {
    super("Email or password invalid");
  }
}
