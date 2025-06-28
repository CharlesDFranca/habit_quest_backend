import { PrismaClientSingleton } from "@/shared/infra/database/PrismaClientSingleton";
import { describe, it, expect } from "vitest";

describe("PrismaClientSingleton unit tests", () => {
  it("should return the same instance on multiple calls", () => {
    const instanceA = PrismaClientSingleton.getInstance();
    const instanceB = PrismaClientSingleton.getInstance();

    expect(instanceA).toBe(instanceB);
  });

  it("should be an instance of PrismaClient", () => {
    const prisma = PrismaClientSingleton.getInstance();

    expect(typeof prisma.user.findMany).toBe("function");
    expect(typeof prisma.$connect).toBe("function");
  });
});
