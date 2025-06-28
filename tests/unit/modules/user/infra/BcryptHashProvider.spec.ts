// tests/BcryptHashProvider.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import { BcryptHashProvider } from "@/modules/users/infra/services/BcryptHashProvider";

let mockedGetSaltRounds: () => number | undefined;

vi.mock("@/config/EnvConfig", () => ({
  envConfig: {
    getSaltRounds: () => mockedGetSaltRounds(),
  },
}));

describe("BcryptHashProvider", () => {
  let hashProvider: BcryptHashProvider;

  beforeEach(() => {
    hashProvider = new BcryptHashProvider();
  });

  it("should generate a hash from a plain password", async () => {
    mockedGetSaltRounds = () => 10;

    const password = "myStrongPassword";
    const hashed = await hashProvider.hash(password);

    expect(typeof hashed).toBe("string");
    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(0);
  });

  it("should return true when comparing the correct password with its hash", async () => {
    mockedGetSaltRounds = () => 10;

    const password = "secure123";
    const hashed = await hashProvider.hash(password);

    const result = await hashProvider.compare(password, hashed);

    expect(result).toBe(true);
  });

  it("should return false when comparing a wrong password with the hash", async () => {
    mockedGetSaltRounds = () => 10;

    const password = "originalPass";
    const wrongPassword = "wrongPass";
    const hashed = await hashProvider.hash(password);

    const result = await hashProvider.compare(wrongPassword, hashed);

    expect(result).toBe(false);
  });

  it("should use the saltRounds value from envConfig", async () => {
    mockedGetSaltRounds = () => 12;

    const spy = vi.spyOn(bcrypt, "hash");
    const password = "anyPassword";

    await hashProvider.hash(password);

    expect(spy).toHaveBeenCalledWith(password, 12);
  });

  it("should fallback to 10 if envConfig.getSaltRounds returns undefined", async () => {
    mockedGetSaltRounds = () => undefined;

    const spy = vi.spyOn(bcrypt, "hash");
    const password = "fallbackTest";

    await hashProvider.hash(password);

    expect(spy).toHaveBeenCalledWith(password, 10);
  });
});
