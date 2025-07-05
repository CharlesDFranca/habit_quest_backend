import { Id } from "@/shared/domain/value-objects/Id";
import { BlockedUser } from "../../domain/entities/BlockedUser";
import { IBlockedUserRepository } from "../../domain/repositories/IBlockedUserRepository";
import { prisma } from "@/shared/infra/database/PrismaClient";
import { BlockedUserPrismaMapper } from "../mappers/BlockedUserPrismaMapper";
import { injectable } from "tsyringe";
import { BlockUserPersistenceException } from "../errors/blocked-user/BlockUserPresistenceException";

@injectable()
export class PrismaBlockedUserRepository implements IBlockedUserRepository {
  async blockUser(blockedUser: BlockedUser): Promise<void> {
    try {
      await prisma.blockedUser.create({
        data: BlockedUserPrismaMapper.toPersistence(blockedUser),
      });
    } catch (error) {
      throw new BlockUserPersistenceException(blockedUser.id, error);
    }
  }

  async unlockUser(
    blockedUser: Id<"UserId">,
    blockedBy: Id<"UserId">,
  ): Promise<void> {
    await prisma.blockedUser.delete({
      where: {
        blockerId_blockedId: {
          blockedId: blockedUser.value,
          blockerId: blockedBy.value,
        },
      },
    });
  }

  async isBlocked(
    blockedBy: Id<"UserId">,
    blockedUser: Id<"UserId">,
  ): Promise<boolean> {
    const isBlocked = await prisma.blockedUser.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: blockedBy.value,
          blockedId: blockedUser.value,
        },
      },
      select: { id: true },
    });

    return !!isBlocked;
  }
}
