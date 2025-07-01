export const validStorageDrivers = ["disk"] as const;
export type StorageDrivers = (typeof validStorageDrivers)[number];