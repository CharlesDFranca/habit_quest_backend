export interface ITokenProvider {
  generate(payload: unknown): string;
  veriry(token: string): unknown;
}
