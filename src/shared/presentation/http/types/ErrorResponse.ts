export type ErrorResponse = {
  code: string;
  type:
    | "Validation"
    | "Domain"
    | "Application"
    | "Infrastructure"
    | "Internal";
  message: string;
  details?: unknown;
};
