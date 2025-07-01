import { StorageDrivers } from "@/config/types/StorageDriversTypes";

export interface IEnvConfig {
  getPort(): number;
  getSaltRounds(): number;
  getStorageDriver(): StorageDrivers;
}
