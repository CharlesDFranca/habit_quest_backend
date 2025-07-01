import {
  IIamgeCompressorService,
  ImageCompressorProps,
} from "@/shared/app/interfaces/IIamgeCompressorService";
import sharp from "sharp";
import { injectable } from "tsyringe";

@injectable()
export class SharpImageCompressor implements IIamgeCompressorService {
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
