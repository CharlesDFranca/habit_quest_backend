import { BlockedUser } from "../../domain/entities/BlockedUser";
import { BlockedUserIdDto } from "../dtos/blocked-user/BlockedUserIdDto";

export class BlockedUserMapper {
  private constructor() {}

  static toId(blockedUser: BlockedUser): BlockedUserIdDto {
    return { blockedUserId: blockedUser.id.value };
  }
}
