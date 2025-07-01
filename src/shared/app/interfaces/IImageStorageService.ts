export type ImageInput = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
};

export interface IImageStorageService {
  save(file: ImageInput): Promise<string>;
  delete(relativePath: string): Promise<void>;
}
