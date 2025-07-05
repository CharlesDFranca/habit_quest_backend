import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { envConfig } from "@/config/env/EnvConfig";

describe("EnvConfig unit tests", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe("getPort", () => {
    it("should return a valid port number", () => {
      process.env.PORT = "3000";

      const port = envConfig.getPort();

      expect(port).toBe(3000);
    });

    it("should throw if PORT is not a number", () => {
      process.env.PORT = "abc";

      expect(() => envConfig.getPort()).toThrowError();
    });

    it("should throw if PORT is less than zero", () => {
      process.env.PORT = "-1";

      expect(() => envConfig.getPort()).toThrowError();
    });
  });

  describe("getSaltRounds", () => {
    it("should return a valid salt rounds number", () => {
      process.env.SALT_ROUNDS = "12";

      const rounds = envConfig.getSaltRounds();

      expect(rounds).toBe(12);
    });

    it("should throw if SALT_ROUNDS is not a number", () => {
      process.env.SALT_ROUNDS = "abc";

      expect(() => envConfig.getSaltRounds()).toThrowError();
    });

    it("should throw if SALT_ROUNDS is less than zero", () => {
      process.env.SALT_ROUNDS = "-5";

      expect(() => envConfig.getSaltRounds()).toThrowError();
    });
  });

  describe("getStorageDriver", () => {
    it("should return a valid storage driver", () => {
      process.env.STORAGE_DRIVER = "disk";

      const driver = envConfig.getStorageDriver();

      expect(driver).toBe("disk");
    });

    it("should throw if STORAGE_DRIVER is empty", () => {
      process.env.STORAGE_DRIVER = "";

      expect(() => envConfig.getStorageDriver()).toThrowError();
    });

    it("should throw if STORAGE_DRIVER is not a string", () => {
      process.env.STORAGE_DRIVER = 1 as unknown as string;

      expect(() => envConfig.getStorageDriver()).toThrowError();
    });

    it("should throw if STORAGE_DRIVER is invalid", () => {
      process.env.STORAGE_DRIVER = "invalid";

      expect(() => envConfig.getStorageDriver()).toThrowError();
    });
  });
});
