import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { envConfig } from "@/config/env/EnvConfig";
import { MissingEnvVariableException } from "@/config/errors/MissingEnvVariableException";
import { InvalidEnvVariableException } from "@/config/errors/InvalidEnvVariableException";
import { validStorageDrivers } from "@/config/types/StorageDriversTypes";

describe("EnvConfig unit tests", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe("getPort", () => {
    it("should return port number if valid", () => {
      process.env.PORT = "3000";

      const result = envConfig.getPort();

      expect(result).toBe(3000);
    });

    it("should throw MissingEnvVariableException if PORT is missing", () => {
      delete process.env.PORT;

      expect(() => envConfig.getPort()).toThrow(
        new MissingEnvVariableException("PORT"),
      );
    });

    it("should throw InvalidEnvVariableException if PORT is not a number", () => {
      process.env.PORT = "abc";

      expect(() => envConfig.getPort()).toThrow(
        new InvalidEnvVariableException("PORT", "It must be a number."),
      );
    });

    it("should throw InvalidEnvVariableException if PORT is negative", () => {
      process.env.PORT = "-1";

      expect(() => envConfig.getPort()).toThrow(
        new InvalidEnvVariableException("PORT", "It cannot be negative."),
      );
    });
  });

  describe("getSaltRounds", () => {
    it("should return salt rounds number if valid", () => {
      process.env.SALT_ROUNDS = "10";

      const result = envConfig.getSaltRounds();

      expect(result).toBe(10);
    });

    it("should throw MissingEnvVariableException if SALT_ROUNDS is missing", () => {
      delete process.env.SALT_ROUNDS;

      expect(() => envConfig.getSaltRounds()).toThrow(
        new MissingEnvVariableException("SALT_ROUNDS"),
      );
    });

    it("should throw InvalidEnvVariableException if SALT_ROUNDS is not a number", () => {
      process.env.SALT_ROUNDS = "abc";

      expect(() => envConfig.getSaltRounds()).toThrow(
        new InvalidEnvVariableException("SALT_ROUNDS", "It must be a number."),
      );
    });

    it("should throw InvalidEnvVariableException if SALT_ROUNDS is negative", () => {
      process.env.SALT_ROUNDS = "-5";

      expect(() => envConfig.getSaltRounds()).toThrow(
        new InvalidEnvVariableException(
          "SALT_ROUNDS",
          "It cannot be negative.",
        ),
      );
    });
  });

  describe("getStorageDriver", () => {
    it("should return storage driver if valid", () => {
      process.env.STORAGE_DRIVER = "disk";

      const result = envConfig.getStorageDriver();

      expect(result).toBe("disk");
    });

    it("should throw MissingEnvVariableException if STORAGE_DRIVER is missing", () => {
      delete process.env.STORAGE_DRIVER;

      expect(() => envConfig.getStorageDriver()).toThrow(
        new MissingEnvVariableException("STORAGE_DRIVER"),
      );
    });

    it("should throw InvalidEnvVariableException if STORAGE_DRIVER is not a string", () => {
      process.env.STORAGE_DRIVER = 123 as unknown as string;

      expect(() => envConfig.getStorageDriver()).toThrow(
        new InvalidEnvVariableException(
          "STORAGE_DRIVER",
          "It must be a string.",
        ),
      );
    });

    it("should throw InvalidEnvVariableException if STORAGE_DRIVER is invalid", () => {
      process.env.STORAGE_DRIVER = "banana";

      expect(() => envConfig.getStorageDriver()).toThrow(
        new InvalidEnvVariableException(
          "STORAGE_DRIVER",
          `Must be one of: [${validStorageDrivers.join(", ")}]`,
        ),
      );
    });
  });

  describe("getJwtSecret", () => {
    const validHexSecret = "a".repeat(128);

    beforeEach(() => {
      delete process.env.JWT_SECRET;
    });

    it("should return JWT secret if valid", () => {
      process.env.JWT_SECRET = validHexSecret;

      const result = envConfig.getJwtSecret();

      expect(result).toBe(validHexSecret);
    });

    it("should throw MissingEnvVariableException if JWT_SECRET is missing", () => {
      expect(() => envConfig.getJwtSecret()).toThrow(
        new MissingEnvVariableException("JWT_SECRET"),
      );
    });

    it("should throw InvalidEnvVariableException if JWT_SECRET is not valid hex", () => {
      process.env.JWT_SECRET = "g".repeat(128);

      expect(() => envConfig.getJwtSecret()).toThrow(
        new InvalidEnvVariableException(
          "JWT_SECRET",
          "It must be a valid hex string.",
        ),
      );
    });

    it("should throw InvalidEnvVariableException if JWT_SECRET length is not 128", () => {
      // string hex válida mas com tamanho incorreto
      process.env.JWT_SECRET = "a".repeat(64);

      expect(() => envConfig.getJwtSecret()).toThrow(
        new InvalidEnvVariableException(
          "JWT_SECRET",
          "It must be 128 hexadecimal characters (64 bytes).",
        ),
      );
    });
  });
});
