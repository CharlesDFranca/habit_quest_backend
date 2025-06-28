import { PrismaClient } from "generated/prisma";

export class PrismaClientSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient();
    }

    return PrismaClientSingleton.instance;
  }
}
