export type ApiResponse<T> = {
  sucess: boolean;
  data: T | null;
  meta: Record<string, unknown> | null;
  errors: Record<string, unknown>;
  message: string;
};
