export class ResponseFormatter {
  private constructor() {}

  static success(
    data: unknown,
    message = "Operation carried out successfully.",
    meta?: Record<string, unknown>,
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
    errors: Record<string, unknown>,
    message = "An error occurred during the operation.",
    meta?: Record<string, unknown>,
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
