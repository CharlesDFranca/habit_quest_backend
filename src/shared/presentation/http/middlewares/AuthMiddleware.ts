import { MalformedAuthHeaderException } from "@/shared/app/errors/MalformedAuthHeaderException";
import { UnauthorizedException } from "@/shared/app/errors/UnauthorizedException";
import { JWTTokenProvider } from "@/shared/infra/services/JWTTokenProvider";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

export class AuthMiddleware {
  private constructor() {}

  static auth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new MalformedAuthHeaderException("Header not provided");
    }

    const [scheme, token] = authHeader.split(" ");

    if (!(scheme === "Bearer") || !token) {
      throw new MalformedAuthHeaderException("Malformed auth header");
    }

    try {
      const tokenProvider = container.resolve(JWTTokenProvider);
      const payload = tokenProvider.verify(token);

      req.user = payload;

      next();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
