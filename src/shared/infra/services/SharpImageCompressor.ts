import {
  IImageCompressorService,
  ImageCompressorProps,
} from "@/shared/app/interfaces/IImageCompressorService";
import sharp from "sharp";
import { injectable } from "tsyringe";

@injectable()
export class SharpImageCompressor implements IImageCompressorService {
  async process(fileProps: ImageCompressorProps): Promise<void> {
    await sharp(fileProps.buffer)
      .resize({ width: 600 })
      .webp({ quality: 60 })
      .toFile(fileProps.outputPath);
  }

  async processMultiple(filesProps: ImageCompressorProps[]): Promise<void> {
    await Promise.all(filesProps.map((fileProps) => this.process(fileProps)));
  }
}
