import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { Id } from "@/shared/domain/value-objects/Id";

type FindUserByIdInput = { userId: string };

type FindUserByIdOutput = {
  userId: string;
  name: string;
  alias: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

@injectable()
export class FindUserByIdUseCase
  implements IUseCase<FindUserByIdInput, FindUserByIdOutput>
{
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: FindUserByIdInput): Promise<FindUserByIdOutput> {
    const id = Id.create<"UserId">({ value: input.userId });

    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      userId: user.id.value,
      name: user.name.value,
      alias: user.alias.value,
      email: user.email.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
