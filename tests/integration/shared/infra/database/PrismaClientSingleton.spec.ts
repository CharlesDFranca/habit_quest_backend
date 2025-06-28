import { PrismaClientSingleton } from "@/shared/infra/database/PrismaClientSingleton";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const prisma = PrismaClientSingleton.getInstance();

describe("PrismaClientSingleton integration tests", () => {
  beforeAll(async () => {
    await prisma.$connect();

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create and retrieve a user from the database", async () => {
    const created = await prisma.user.create({
      data: {
        id: "user-id-1",
        name: "Alice",
        email: "alice@example.com",
        alias: "alice123",
        password: "hashedpassword",
      },
    });

    const found = await prisma.user.findUnique({
      where: { email: "alice@example.com" },
    });

    expect(found).not.toBeNull();
    expect(found?.name).toBe("Alice");
    expect(found?.id).toBe(created.id);
  });
});
