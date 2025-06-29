import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { Id } from "@/shared/domain/value-objects/Id";

type FindUserByIdInput = { userId: string };

type FindUserByIdOutput = User;

@injectable()
export class FindUserByIdUseCase
  implements IUseCase<FindUserByIdInput, FindUserByIdOutput>
{
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: FindUserByIdInput): Promise<User> {
    const id = Id.create<"UserId">({ value: input.userId });

    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
