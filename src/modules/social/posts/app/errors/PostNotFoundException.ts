import { AppError } from "@/shared/app/errors/AppError";
import { ErrorCodes } from "@/shared/errors/enums/codes";

export class PostNotFoundException extends AppError {
  code = ErrorCodes.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}
