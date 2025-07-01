export type ImageCompressorProps = {
  buffer: Buffer;
  outputPath: string;
};

export interface IIamgeCompressorService {
  process(fileProps: ImageCompressorProps): Promise<void>;
  processMultiple(filesProps: ImageCompressorProps[]): Promise<void>;
}
