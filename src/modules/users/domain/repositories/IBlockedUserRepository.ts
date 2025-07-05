import { Id } from "@/shared/domain/value-objects/Id";
import { BlockedUser } from "../entities/BlockedUser";

export interface IBlockedUserRepository {
  blockUser(blockedUser: BlockedUser): Promise<void>;
  unlockUser(blockedBy: Id<"UserId">, blockedUser: Id<"UserId">): Promise<void>;
  isBlocked(
    blockerBy: Id<"UserId">,
    blockedUser: Id<"UserId">,
  ): Promise<boolean>;
}
