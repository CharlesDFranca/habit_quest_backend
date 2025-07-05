import { IBlockedUserRepository } from "@/modules/users/domain/repositories/IBlockedUserRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { Id } from "@/shared/domain/value-objects/Id";
import { inject, injectable } from "tsyringe";
import { UserNotFoundException } from "../../errors/UserNotFoundException";
import { UserIsNotBlockedException } from "../../errors/UserIsNotBlockedException";

type UnblockUserInput = {
  blockedId: string;
  blockerId: string;
};

type UnblockUserOutput = void;

@injectable()
export class UnblockUserUseCase
  implements IUseCase<UnblockUserInput, UnblockUserOutput>
{
  constructor(
    @inject("BlockedUserRepository")
    private readonly blockedUserRepository: IBlockedUserRepository,
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: UnblockUserInput): Promise<void> {
    const blockedId = Id.create<"UserId">({ value: input.blockedId });
    const blockerId = Id.create<"UserId">({ value: input.blockerId });

    const [blockedIdExists, blockerIdExists] = await Promise.all([
      !!this.userRepository.findUserById(blockedId),
      !!this.userRepository.findUserById(blockerId),
    ]);

    if (!blockedIdExists) {
      throw new UserNotFoundException(
        `User not found by id: ${blockedId.value}`,
      );
    }

    if (!blockerIdExists) {
      throw new UserNotFoundException(
        `User not found by id: ${blockerId.value}`,
      );
    }

    const isBlocked = await this.blockedUserRepository.isBlocked(
      blockerId,
      blockedId,
    );

    if (!isBlocked) {
      throw new UserIsNotBlockedException(blockedId);
    }

    await this.blockedUserRepository.unblockUser(blockerId, blockedId);
  }
}
