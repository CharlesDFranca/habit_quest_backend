import { ErrorCodes } from "@/shared/errors/enums/codes";
import { InfraError } from "@/shared/infra/errors/InfraError";

export class InvalidEnvVariableException extends InfraError {
  code = ErrorCodes.INVALID_ENV_VARIABLE;

  constructor(variable: string, reason: string) {
    super(`Invalid environment variable: ${variable}. ${reason}`);
  }
}
