import { Id } from "@/shared/domain/value-objects/Id";
import { Email } from "../../value-objects/Email";

export interface IEnsureEmailIsUniqueService {
  assertEmailIsUnique(email: Email, userId: Id<"UserId">): Promise<void>;
}
