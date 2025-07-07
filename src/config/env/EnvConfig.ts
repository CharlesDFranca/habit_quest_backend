import "dotenv/config";
import { IEnvConfig } from "./interfaces/IEnvConfig";
import {
  StorageDrivers,
  validStorageDrivers,
} from "../types/StorageDriversTypes";
import { MissingEnvVariableException } from "../errors/MissingEnvVariableException";
import { InvalidEnvVariableException } from "../errors/InvalidEnvVariableException";

class EnvConfig implements IEnvConfig {
  getPort(): number {
    const PORT = process.env.PORT;

    if (!PORT) {
      throw new MissingEnvVariableException("PORT");
    }

    const portNum = Number(PORT);

    if (isNaN(portNum)) {
      throw new InvalidEnvVariableException("PORT", "It must be a number.");
    }

    if (portNum < 0) {
      throw new InvalidEnvVariableException("PORT", "It cannot be negative.");
    }

    return portNum;
  }

  getSaltRounds(): number {
    const SALT_ROUNDS = process.env.SALT_ROUNDS;

    if (!SALT_ROUNDS) {
      throw new MissingEnvVariableException("SALT_ROUNDS");
    }

    const saltNum = Number(SALT_ROUNDS);

    if (isNaN(saltNum)) {
      throw new InvalidEnvVariableException(
        "SALT_ROUNDS",
        "It must be a number.",
      );
    }

    if (saltNum < 0) {
      throw new InvalidEnvVariableException(
        "SALT_ROUNDS",
        "It cannot be negative.",
      );
    }

    return saltNum;
  }

  getStorageDriver(): StorageDrivers {
    const STORAGE_DRIVER = process.env.STORAGE_DRIVER;

    if (!STORAGE_DRIVER) {
      throw new MissingEnvVariableException("STORAGE_DRIVER");
    }

    if (typeof STORAGE_DRIVER !== "string") {
      throw new InvalidEnvVariableException(
        "STORAGE_DRIVER",
        "It must be a string.",
      );
    }

    if (!validStorageDrivers.includes(STORAGE_DRIVER as StorageDrivers)) {
      throw new InvalidEnvVariableException(
        "STORAGE_DRIVER",
        `Must be one of: [${validStorageDrivers.join(", ")}]`,
      );
    }

    return STORAGE_DRIVER as StorageDrivers;
  }

  getJwtSecret(): string {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new MissingEnvVariableException("JWT_SECRET");
    }

    if (!/^[0-9a-fA-F]+$/.test(JWT_SECRET)) {
      throw new InvalidEnvVariableException(
        "JWT_SECRET",
        "It must be a valid hex string.",
      );
    }

    if (JWT_SECRET.length !== 128) {
      throw new InvalidEnvVariableException(
        "JWT_SECRET",
        "It must be 128 hexadecimal characters (64 bytes).",
      );
    }

    return JWT_SECRET;
  }
}

const envConfig = new EnvConfig();

export { envConfig };
