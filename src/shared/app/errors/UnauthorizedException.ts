import { ErrorCodes } from "@/shared/errors/enums/codes";
import { AppError } from "./AppError";

export class UnauthorizedException extends AppError {
  code = ErrorCodes.UNAUTHORIZED;

  constructor(reason = "Unauthorized") {
    super(reason);
  }
}
