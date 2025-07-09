export type JWTPayload = {
  sub: string;
  [key: string]: unknown;
};

export interface ITokenProvider {
  generate(payload: JWTPayload): string;
  verify(token: string): JWTPayload;
}
