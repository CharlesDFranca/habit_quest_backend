import { JWTPayload } from "@/shared/app/interfaces/JWTPayload";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}