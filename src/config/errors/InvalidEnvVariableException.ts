import { ErrorCodes } from "@/shared/errors/enums/ErrorCodes";
import { InfraError } from "@/shared/infra/errors/InfraError";

export class InvalidEnvVariableException extends InfraError {
  code = ErrorCodes.INVALID_ENV_VARIABLE;

  constructor(variable: string, reason: string) {
    super(`Invalid environment variable: ${variable}. ${reason}`);
  }
}
