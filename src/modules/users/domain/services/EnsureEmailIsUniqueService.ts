import { Id } from "@/shared/domain/value-objects/Id";
import { IUserRepository } from "../repositories/IUserRepository";
import { Email } from "../value-objects/Email";
import { IEnsureEmailIsUniqueService } from "./interfaces/IEnsureEmailIsUniqueService";

export class EnsureEmailIsUniqueService implements IEnsureEmailIsUniqueService {
  constructor(private readonly userRepository: IUserRepository) {}

  async assertEmailIsUnique(email: Email, userId: Id<"UserId">): Promise<void> {
    const emailAlreadyUsed = await this.userRepository.findUserByEmail(email);

    if (emailAlreadyUsed && !emailAlreadyUsed.id?.isEqual(userId)) {
      throw new Error(`Email already used: ${email.value}`);
    }
  }
}
