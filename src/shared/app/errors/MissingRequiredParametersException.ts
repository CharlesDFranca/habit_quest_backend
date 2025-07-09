import { ErrorCodes } from "@/shared/errors/enums/codes";
import { AppError } from "./AppError";

export class MissingRequiredParametersException extends AppError {
  code = ErrorCodes.MISSING_REQUIRED_PARAMETERS;

  constructor(missingParameter: string[]) {
    super(
      `Missing required parameter${missingParameter.length > 1 ? "s" : ""}: [${missingParameter.join(", ")}]`,
    );
  }
}
