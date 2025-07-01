import {
  ImageInput,
  IImageStorageService,
} from "@/shared/app/interfaces/IImageStorageService";

import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { SharpImageCompressor } from "./SharpImageCompressor";
import { injectable } from "tsyringe";

@injectable()
export class DiskStorageService implements IImageStorageService {
  private readonly uploadFolder = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "uploads",
  );

  async save(file: ImageInput): Promise<string> {
    const hash = randomBytes(10).toString("hex");
    const filename = `${hash}-${file.originalName.replace(/\s+/g, "-")}.webp`;
    const outputPath = path.join(this.uploadFolder, filename);

    const service = new SharpImageCompressor();

    await service.process({ buffer: file.buffer, outputPath });

    return `/uploads/${filename}`;
  }

  async delete(relativePath: string): Promise<void> {
    const fullPath = path.resolve(
      this.uploadFolder,
      relativePath.replace("/uploads/", ""),
    );
    await fs.unlink(fullPath).catch(() => null);
  }
}
