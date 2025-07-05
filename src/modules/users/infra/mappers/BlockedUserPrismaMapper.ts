import { BlockedUser as PrismaBlockedUser } from "generated/prisma";
import { BlockedUser } from "../../domain/entities/BlockedUser";
import { Id } from "@/shared/domain/value-objects/Id";

export class BlockedUserPrismaMapper {
  private constructor() {}

  static toDomain(blockedUserPersitedData: PrismaBlockedUser): BlockedUser {
    return BlockedUser.create(
      {
        blockedBy: Id.create({ value: blockedUserPersitedData.blockerId }),
        blockedUser: Id.create({ value: blockedUserPersitedData.blockedId }),
        createdAt: blockedUserPersitedData.blockedAt,
      },
      Id.create({ value: blockedUserPersitedData.id }),
    );
  }

  static toPersistence(blockedUser: BlockedUser): PrismaBlockedUser {
    return {
      id: blockedUser.id.value,
      blockedId: blockedUser.blokedUser.value,
      blockerId: blockedUser.blockdBy.value,
      blockedAt: blockedUser.createdAt,
    };
  }
}
