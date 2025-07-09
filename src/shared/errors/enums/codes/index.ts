import { UserErrorCodes } from "./UserErrorCodes";
import { PostErrorCodes } from "./PostErrorCodes";
import { InfraErrorCodes } from "./InfraErrorCodes";
import { AuthErrorCodes } from "./AuthErrorCodes";
import { AppErrorCodes } from "./AppErrorCodes";
import { DomainErrorCodes } from "./DomainErrorCodes";

export const ErrorCodes = {
  ...UserErrorCodes,
  ...PostErrorCodes,
  ...DomainErrorCodes,
  ...AppErrorCodes,
  ...InfraErrorCodes,
  ...AuthErrorCodes,
};

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
