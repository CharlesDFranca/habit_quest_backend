import { DomainError } from "@/shared/domain/errors/DomainError";
import { ErrorResponse } from "./types/ErrorResponse";
import { AppError } from "@/shared/app/errors/AppError";
import { BaseError } from "@/shared/errors/BaseError";

export class HttpErrorMapper {
  static toErrorResponse(error: Error): ErrorResponse {
    console.log("💥 Error caught:");
    console.log("- name:", error.name);
    console.log("- constructor.name:", error.constructor.name);
    console.log("- instanceof DomainError:", error instanceof DomainError);
    console.log("- instanceof AppError:", error instanceof AppError);

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

    return {
      code: "UNKNOWN_ERROR",
      type: "Internal",
      message: error.message ?? "Unexpected error occurred.",
    };
  }
}

const isAppError = (error: Error): error is AppError => {
  return error.name === "AppError" || error instanceof AppError;
};
const isDomainError = (error: Error): error is DomainError => {
  return error.name === "DomainError" || error instanceof DomainError;
};
