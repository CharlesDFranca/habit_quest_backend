import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";
import { AppError } from "./AppError";

export class MissingRequiredFieldsException extends AppError {
  code = ErrorCodes.MISSING_REQUIRED_FIELDS;

  constructor(missingFields: string[]) {
    super(
      `Missing required field${missingFields.length > 1 ? "s" : ""}: [${missingFields.join(", ")}]`,
    );
  }
}
