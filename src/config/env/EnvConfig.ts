import "dotenv/config";
import { IEnvConfig } from "./interfaces/IEnvConfig";
import {
  StorageDrivers,
  validStorageDrivers,
} from "../types/StorageDriversTypes";

class EnvConfig implements IEnvConfig {
  getPort(): number {
    const PORT = process.env.PORT;

    if (isNaN(Number(PORT))) {
      throw new Error("PORT needs to be a number");
    }

    if (Number(PORT) < 0) {
      throw new Error("PORT cannot be less than zero");
    }

    return Number(PORT);
  }

  getSaltRounds(): number {
    const SALT_ROUNDS = process.env.SALT_ROUNDS;

    if (isNaN(Number(SALT_ROUNDS))) {
      throw new Error("SALT_ROUNDS needs to be a number");
    }

    if (Number(SALT_ROUNDS) < 0) {
      throw new Error("SALT_ROUNDS cannot be less than zero");
    }

    return Number(SALT_ROUNDS);
  }

  getStorageDriver(): StorageDrivers {
    const STORAGE_DRIVER = process.env.STORAGE_DRIVER;

    if (!STORAGE_DRIVER) {
      throw new Error("STORAGE_DRIVER cannot be empty");
    }

    if (typeof STORAGE_DRIVER !== "string") {
      throw new Error("STORAGE_DRIVER needs to be a string");
    }

    if (!validStorageDrivers.includes(STORAGE_DRIVER as StorageDrivers)) {
      throw new Error("STORAGE_DRIVER invalid");
    }

    return STORAGE_DRIVER as StorageDrivers;
  }
}

const envConfig = new EnvConfig();

export { envConfig };
