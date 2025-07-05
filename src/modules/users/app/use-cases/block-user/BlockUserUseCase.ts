import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { Id } from "@/shared/domain/value-objects/Id";
import { BlockedUserIdDto } from "../../dtos/blocked-user/BlockedUserIdDto";
import { IBlockedUserRepository } from "@/modules/users/domain/repositories/IBlockedUserRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { UserNotFoundException } from "../../errors/UserNotFoundException";
import { BlockedUser } from "@/modules/users/domain/entities/BlockedUser";
import { BlockedUserMapper } from "../../mappers/BlockedUserMapper";
import { CannotBlockYourselfException } from "@/modules/users/domain/errors/CannotBlockYourselfException";
import { UserAlreadyBlockedException } from "../../errors/UserAlreadyBlockedException";
import { BlockUserFailedException } from "../../errors/BlockUserFailedException";

type BlockUserInput = {
  blockedBy: string;
  blockedUser: string;
};

type BlockUserOutput = BlockedUserIdDto;

@injectable()
export class BlockUserUseCase
  implements IUseCase<BlockUserInput, BlockUserOutput>
{
  constructor(
    @inject("BlockedUserRepository")
    private readonly blockedUserRepository: IBlockedUserRepository,
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: BlockUserInput): Promise<BlockedUserIdDto> {
    const blockedById = Id.create<"UserId">({ value: input.blockedBy });
    const blockedUserId = Id.create<"UserId">({ value: input.blockedUser });

    if (blockedById.isEqual(blockedUserId)) {
      throw new CannotBlockYourselfException();
    }

    const [blockedByExists, blockedUserExists] = await Promise.all([
      !!this.userRepository.findUserById(blockedById),
      !!this.userRepository.findUserById(blockedUserId),
    ]);

    if (!blockedByExists) {
      throw new UserNotFoundException(
        `User not found by id: ${blockedById.value}`,
      );
    }

    if (!blockedUserExists) {
      throw new UserNotFoundException(
        `User not found by id: ${blockedUserId.value}`,
      );
    }

    const alreadyBlocked = await this.blockedUserRepository.isBlocked(
      blockedById,
      blockedUserId,
    );

    if (alreadyBlocked) {
      throw new UserAlreadyBlockedException(blockedUserId);
    }

    const blockedUser = BlockedUser.create({
      blockedBy: blockedById,
      blockedUser: blockedUserId,
    });

    try {
      await this.blockedUserRepository.blockUser(blockedUser);
    } catch {
      throw new BlockUserFailedException(blockedUser.id);
    }

    return BlockedUserMapper.toId(blockedUser);
  }
}
