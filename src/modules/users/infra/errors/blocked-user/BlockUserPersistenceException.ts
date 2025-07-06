import { Id } from "@/shared/domain/value-objects/Id";
import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";
import { InfraError } from "@/shared/infra/errors/InfraError";

export class BlockUserPersistenceException extends InfraError {
  code = ErrorCodes.BLOCK_USER_PERSISTENCE;
  original?: unknown;

  constructor(blockedUserId: Id<"BlockedUserId">, originalError?: unknown) {
    const baseMessage = `Failed to persist blocked user with id: ${blockedUserId.value}`;
    const message =
      originalError && typeof originalError === "object" && "message" in originalError
        ? `${baseMessage}. Reason: ${(originalError as Error).message}`
        : baseMessage;

    super(message);
    this.original = originalError;
  }
}

