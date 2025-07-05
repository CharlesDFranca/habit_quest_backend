import { Response, Request, NextFunction } from "express";
import { HttpErrorMapper } from "../HttpErrorMapper";
import { HttpStatusCodeMapper } from "../HttpStatusCodeMapper";
import { ResponseFormatter } from "../ResponseFormatter";

export class ErrorMiddleware {
  private constructor() {}

  static use(
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ): void {
    const error = err instanceof Error ? err : new Error(String(err));

    const mappedError = HttpErrorMapper.toErrorResponse(error);
    const statusCode = HttpStatusCodeMapper.fromCode(mappedError.code);

    const response = ResponseFormatter.error(mappedError);

    res.status(statusCode).json(response);
  }
}
