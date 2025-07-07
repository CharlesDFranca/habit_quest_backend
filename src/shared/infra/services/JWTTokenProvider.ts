import jwt from "jsonwebtoken";
import {
  ITokenProvider,
  JWTPayload,
} from "@/shared/app/interfaces/ITokenProvider";
import { envConfig } from "@/config/env/EnvConfig";
import { injectable } from "tsyringe";

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
