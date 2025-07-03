import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { UserNotFoundException } from "../errors/UserNotFoundException";

type FindUserByAliasInput = { alias: string };

type FindUserByAliasOutput = {
  userId: string;
  name: string;
  alias: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

@injectable()
export class FindUserByAliasUseCase
  implements IUseCase<FindUserByAliasInput, FindUserByAliasOutput>
{
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: FindUserByAliasInput): Promise<FindUserByAliasOutput> {
    const alias = Alias.create({ value: input.alias });

    const user = await this.userRepository.findUserByAlias(alias);

    if (!user) {
      throw new UserNotFoundException(
        `User not found by "alias": ${alias.value}`,
      );
    }

    return {
      userId: user.id.value,
      name: user.name.value,
      email: user.email.value,
      alias: user.alias.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
