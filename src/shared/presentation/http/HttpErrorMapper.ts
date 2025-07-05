/* eslint-disable @typescript-eslint/no-explicit-any */
import { DomainError } from "@/shared/domain/errors/DomainError";
import { ErrorResponse } from "./types/ErrorResponse";
import { AppError } from "@/shared/app/errors/AppError";
import { BaseError } from "@/shared/errors/BaseError";
import { InfraError } from "@/shared/infra/errors/InfraError";

export class HttpErrorMapper {
  static toErrorResponse(error: Error): ErrorResponse {
    if (isDomainError(error)) {
      return {
        code: (error as BaseError).code ?? "DOMAIN_ERROR",
        type: "Domain",
        message: error.message,
      };
    }

    if (isAppError(error)) {
      return {
        code: (error as BaseError).code ?? "APPLICATION_ERROR",
        type: "Application",
        message: error.message,
      };
    }

    if (isInfraError(error)) {
      return {
        code: (error as BaseError).code ?? "INFRA_ERROR",
        type: "Infrastructure",
        message: error.message,
        details: (error as any).original ?? undefined,
      };
    }

    return {
      code: "UNKNOWN_ERROR",
      type: "Internal",
      message: error.message ?? "Unexpected error occurred.",
      details: (error as any).original ?? undefined,
    };
  }
}

const isAppError = (error: Error): error is AppError => {
  return error.name === "AppError" || error instanceof AppError;
};
const isDomainError = (error: Error): error is DomainError => {
  return error.name === "DomainError" || error instanceof DomainError;
};

const isInfraError = (error: Error): error is InfraError => {
  return error.name === "InfraError" || error instanceof InfraError;
};
