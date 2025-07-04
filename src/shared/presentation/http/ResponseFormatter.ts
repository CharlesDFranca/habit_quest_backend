import { ErrorResponse } from "./types/ErrorResponse";

export class ResponseFormatter {
  private constructor() {}

  static success(
    data: unknown,
    meta?: Record<string, unknown>,
    message = "Operation carried out successfully.",
  ) {
    return {
      sucess: true,
      data,
      meta: meta ?? null,
      errors: {},
      message,
    };
  }

  static error(
    errors: ErrorResponse,
    meta?: Record<string, unknown>,
    message = "An error occurred during the operation.",
  ) {
    return {
      sucess: false,
      data: null,
      meta: meta ?? null,
      errors,
      message,
    };
  }
}
