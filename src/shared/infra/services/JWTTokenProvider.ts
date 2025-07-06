import jwt from "jsonwebtoken";
import { ITokenProvider } from "@/shared/app/interfaces/ITokenProvider";
import { envConfig } from "@/config/env/EnvConfig";
import { injectable } from "tsyringe";

export type JWTPayload = {
  sub: string;
  [key: string]: unknown;
};

@injectable()
export class JWTTokenProvider implements ITokenProvider {
  private JWT_SECRET = envConfig.getJwtSecret();

  generate(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET);
  }

  veriry(token: string): JWTPayload {
    return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
  }
}
