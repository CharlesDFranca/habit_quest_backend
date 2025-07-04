import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";
import { AppError } from "./AppError";

export class MissingRequiredParametersException extends AppError {
  code = ErrorCodes.MISSING_REQUIRED_PARAMETERS;

  constructor(missingParameter: string[]) {
    super(
      `Missing required parameter${missingParameter.length > 1 ? "s" : ""}: [${missingParameter.join(", ")}]`,
    );
  }
}
