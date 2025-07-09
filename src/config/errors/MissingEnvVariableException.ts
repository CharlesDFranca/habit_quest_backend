import { ErrorCodes } from "@/shared/errors/enums/codes";
import { InfraError } from "@/shared/infra/errors/InfraError";

export class MissingEnvVariableException extends InfraError {
  code = ErrorCodes.MISSING_ENV_VARIABLE;

  constructor(variable: string) {
    super(`Missing required environment variable: ${variable}`);
  }
}
