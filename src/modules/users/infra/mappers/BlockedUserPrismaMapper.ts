import { BlockedUser as PrismaBlockedUser } from "generated/prisma";
import { BlockedUser } from "../../domain/entities/BlockedUser";
import { Id } from "@/shared/domain/value-objects/Id";

export class BlockedUserPrismaMapper {
  private constructor() {}

  static toDomain(blockedUserPersitedData: PrismaBlockedUser): BlockedUser {
    return BlockedUser.create(
      {
        blockerId: Id.create({ value: blockedUserPersitedData.blockerId }),
        blockedId: Id.create({ value: blockedUserPersitedData.blockedId }),
        createdAt: blockedUserPersitedData.blockedAt,
      },
      Id.create({ value: blockedUserPersitedData.id }),
    );
  }

  static toPersistence(blockedUser: BlockedUser): PrismaBlockedUser {
    return {
      id: blockedUser.id.value,
      blockerId: blockedUser.blockerId.value,
      blockedId: blockedUser.blockedId.value,
      blockedAt: blockedUser.createdAt,
    };
  }
}
