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
  blockerId: string;
  blockedId: string;
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
    const blockerId = Id.create<"UserId">({ value: input.blockerId });
    const blockedId = Id.create<"UserId">({ value: input.blockedId });

    if (blockerId.isEqual(blockedId)) {
      throw new CannotBlockYourselfException();
    }

    const [blockerIdExists, blockedIdExists] = await Promise.all([
      !!this.userRepository.findUserById(blockerId),
      !!this.userRepository.findUserById(blockedId),
    ]);

    if (!blockerIdExists) {
      throw new UserNotFoundException(
        `User not found by id: ${blockerId.value}`,
      );
    }

    if (!blockedIdExists) {
      throw new UserNotFoundException(
        `User not found by id: ${blockedId.value}`,
      );
    }

    const alreadyBlocked = await this.blockedUserRepository.isBlocked(
      blockerId,
      blockedId,
    );

    if (alreadyBlocked) {
      throw new UserAlreadyBlockedException(blockedId);
    }

    const blockedUser = BlockedUser.create({
      blockerId,
      blockedId,
    });

    try {
      await this.blockedUserRepository.blockUser(blockedUser);
    } catch {
      throw new BlockUserFailedException(blockedUser.id);
    }

    return BlockedUserMapper.toId(blockedUser);
  }
}
