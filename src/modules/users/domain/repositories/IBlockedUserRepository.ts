import { Id } from "@/shared/domain/value-objects/Id";
import { BlockedUser } from "../entities/BlockedUser";

export interface IBlockedUserRepository {
  blockUser(blockedUser: BlockedUser): Promise<void>;
  unblockUser(blockerId: Id<"UserId">, blockedId: Id<"UserId">): Promise<void>;
  isBlocked(blockerId: Id<"UserId">, blockedId: Id<"UserId">): Promise<boolean>;
}
