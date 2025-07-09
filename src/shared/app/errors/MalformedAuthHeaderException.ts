import { ErrorCodes } from "@/shared/errors/enums/codes";
import { AppError } from "./AppError";

export class MalformedAuthHeaderException extends AppError {
  code = ErrorCodes.MALFORMED_AUTH_HEADER;

  constructor(message: string) {
    super(message);
  }
}
