import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";

export class HttpStatusCodeMapper {
  static fromCode(code: string): number {
    switch (code) {
      case ErrorCodes.EMAIL_ALREADY_USED:
      case ErrorCodes.ALIAS_ALREADY_USED:
      case ErrorCodes.ALREADY_LIKED:
      case ErrorCodes.USER_ALREADY_BLOCKED:
        return 409;

      case ErrorCodes.NOT_FOUND:
        return 404;

      case ErrorCodes.INVALID_VALUE_OBJECT:
      case ErrorCodes.INVALID_ENTITY_TIMESTAMPS:
      case ErrorCodes.EXCEEDED_POST_IMAGE_LIMIT:
      case ErrorCodes.CANNOT_BLOCK_YOURSELF:
        return 422;

      case ErrorCodes.MISSING_REQUIRED_FIELDS:
      case ErrorCodes.MISSING_REQUIRED_PARAMETERS:
      case ErrorCodes.INVALID_ENV_VARIABLE:
      case ErrorCodes.MISSING_ENV_VARIABLE:
        return 400;

      case ErrorCodes.BLOCK_USER_PERSISTENCE:
        return 500;

      default:
        return 500;
    }
  }
}
