import multer, { StorageEngine } from "multer";
import { envConfig } from "./env/EnvConfig";
import { StorageDrivers } from "./types/StorageDriversTypes";

interface IUploadConfig {
  driver: StorageDrivers;
  directory: string;
  multer: {
    storage: StorageEngine;
    limits: {
      fileSize: number;
    };
    fileFilter?: multer.Options["fileFilter"];
  };
}

const uploadConfig: IUploadConfig = {
  driver: envConfig.getStorageDriver(),
  multer: {
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter(req, file, callback) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpeg",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(
          new Error(
            "Invalid file type. Only JPG, PNG, JPEG, and WEBP are allowed.",
          ),
        );
      }
    },
  },
} as IUploadConfig;

export { uploadConfig };
