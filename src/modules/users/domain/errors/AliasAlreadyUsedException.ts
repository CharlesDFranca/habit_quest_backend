import { DomainError } from "@/shared/domain/erros/DomainError";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";

export class AliasAlreadyUsedException extends DomainError {
  code = ErrorCodes.ALIAS_ALREADY_USED;

  constructor(alias: Alias) {
    super(`Alias already used: ${alias.value}`);
  }
}
