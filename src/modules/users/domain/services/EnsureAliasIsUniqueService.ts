import { Alias } from "@/shared/domain/value-objects/Alias";
import { IUserRepository } from "../repositories/IUserRepository";
import { Id } from "@/shared/domain/value-objects/Id";
import { IEnsureAliasIsUniqueService } from "./interfaces/IEnsureAliasIsUniqueService";

export class EnsureAliasIsUniqueService implements IEnsureAliasIsUniqueService {
  constructor(private readonly userRepository: IUserRepository) {}

  async assertAliasIsUnique(alias: Alias, userId: Id<"UserId">): Promise<void> {
    const aliasAlreadyUsed = await this.userRepository.findUserByAlias(alias);

    if (aliasAlreadyUsed && !aliasAlreadyUsed.id?.isEqual(userId)) {
      throw new Error(`Alias already used: ${alias.value}`);
    }
  }
}
