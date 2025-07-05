import { DomainError } from "@/shared/domain/errors/DomainError";
import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";

export class ExceededPostImageLimitException extends DomainError {
  code = ErrorCodes.EXCEEDED_POST_IMAGE_LIMIT;

  constructor(limit: number) {
    super(
      `It is not possible to add more than ${limit} images to a post`,
    );
  }
}
