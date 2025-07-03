import { Id } from "@/shared/domain/value-objects/Id";
import { IUserRepository } from "../repositories/IUserRepository";
import { Email } from "../value-objects/Email";
import { IEnsureEmailIsUniqueService } from "./interfaces/IEnsureEmailIsUniqueService";
import { EmailAlreadyUsedException } from "../errors/EmailAlreadyUsedException";

export class EnsureEmailIsUniqueService implements IEnsureEmailIsUniqueService {
  constructor(private readonly userRepository: IUserRepository) {}

  async assertEmailIsUnique(
    email: Email,
    userIdToIgnore?: Id<"UserId">,
  ): Promise<void> {
    const emailAlreadyUsed = await this.userRepository.findUserByEmail(email);

    if (
      emailAlreadyUsed &&
      (!userIdToIgnore || !emailAlreadyUsed.id?.isEqual(userIdToIgnore))
    ) {
      throw new EmailAlreadyUsedException(email);
    }
  }
}
