import { envConfig } from "@/config/env/EnvConfig";
import { describe, it, expect } from "vitest";

describe("EnvConfig unit tests", () => {
  const sut = envConfig;

  it("should be return a port number", () => {
    const port = sut.getPort();

    expect(port).toBeDefined();
    expect(typeof port).toBe("number");
    expect(port).toBe(3000);
  });

  it("should be return a salt rounds number", () => {
    const saltRounds = sut.getSaltRounds();

    expect(saltRounds).toBeDefined();
    expect(typeof saltRounds).toBe("number");
    expect(saltRounds).toBe(envConfig.getSaltRounds());
  });
});
