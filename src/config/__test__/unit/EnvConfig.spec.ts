import { describe, it, expect } from "vitest";
import { envConfig } from "../../EnvConfig";

describe("EnvConfig unit tests", () => {
  const sut = envConfig;

  it("should be return a port number", () => {
    const port = sut.getPort();

    expect(port).toBeDefined();
    expect(typeof port).toBe("number");
    expect(port).toBe(3000);
  });
});
