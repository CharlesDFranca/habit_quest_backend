import { Alias } from "@/shared/domain/value-objects/Alias";
import { IUserRepository } from "../repositories/IUserRepository";
import { Id } from "@/shared/domain/value-objects/Id";
import { IEnsureAliasIsUniqueService } from "./interfaces/IEnsureAliasIsUniqueService";
import { AliasAlreadyUsedException } from "../errors/AliasAlreadyUsedException";

export class EnsureAliasIsUniqueService implements IEnsureAliasIsUniqueService {
  constructor(private readonly userRepository: IUserRepository) {}

  async assertAliasIsUnique(
    alias: Alias,
    userIdToIgnore?: Id<"UserId">,
  ): Promise<void> {
    const aliasAlreadyUsed = await this.userRepository.findUserByAlias(alias);

    if (
      aliasAlreadyUsed &&
      (!userIdToIgnore || !aliasAlreadyUsed.id?.isEqual(userIdToIgnore))
    ) {
      throw new AliasAlreadyUsedException(alias);
    }
  }
}
