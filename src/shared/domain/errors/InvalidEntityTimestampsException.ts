import { ErrorCodes } from "@/shared/errors/enums/codes";
import { DomainError } from "./DomainError";

export class InvalidEntityTimestampsException extends DomainError {
  code = ErrorCodes.INVALID_ENTITY_TIMESTAMPS;

  constructor() {
    super("Entity creation date cannot be after updated date");
  }
}
