import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";

export class HttpStatusCodeMapper {
  static fromCode(code: string): number {
    switch (code) {
      case ErrorCodes.EMAIL_ALREADY_USED:
      case ErrorCodes.ALIAS_ALREADY_USED:
      case ErrorCodes.ALREADY_LIKED:
        return 409;

      case ErrorCodes.NOT_FOUND:
        return 404;

      case ErrorCodes.INVALID_VALUE_OBJECT:
      case ErrorCodes.INVALID_ENTITY_TIMESTAMPS:
        return 422;

      case ErrorCodes.MISSING_REQUIRED_FIELDS:
      case ErrorCodes.MISSING_REQUIRED_PARAMETERS:
        return 400;

      default:
        return 500;
    }
  }
}
