import "reflect-metadata";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import jwt from "jsonwebtoken";
import { JWTTokenProvider } from "@/shared/infra/services/JWTTokenProvider";

const validSecret = "a".repeat(128); 

describe("JWTTokenProvider", () => {
  let tokenProvider: JWTTokenProvider;

  beforeEach(() => {
    process.env.JWT_SECRET = validSecret;
    tokenProvider = new JWTTokenProvider();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.JWT_SECRET;
  });

  describe("generate", () => {
    it("should return a JWT token given a valid payload", () => {
      const payload = { sub: "user-123", role: "admin" };

      const token = tokenProvider.generate(payload);

      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should call jwt.sign with correct arguments", () => {
      const payload = { sub: "user-abc", exp: 123456 };
      const spy = vi.spyOn(jwt, "sign");

      tokenProvider.generate(payload);

      expect(spy).toHaveBeenCalledWith(payload, validSecret);
    });
  });

  describe("verify", () => {
    it("should return the original payload when given a valid token", () => {
      const payload = { sub: "user-xyz", role: "member" };
      const token = jwt.sign(payload, validSecret);

      const verified = tokenProvider.verify(token);

      expect(verified.sub).toBe("user-xyz");
      expect(verified.role).toBe("member");
    });

    it("should call jwt.verify with correct arguments", () => {
      const token = jwt.sign({ sub: "user-def" }, validSecret);
      const spy = vi.spyOn(jwt, "verify");

      tokenProvider.verify(token);

      expect(spy).toHaveBeenCalledWith(token, validSecret);
    });

    it("should throw if the token is invalid", () => {
      const invalidToken = "this.is.not.valid";

      expect(() => tokenProvider.verify(invalidToken)).toThrow();
    });
  });
});
