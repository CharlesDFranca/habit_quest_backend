import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { Alias } from "@/shared/domain/value-objects/Alias";

type FindUserByAliasInput = { alias: string };

type FindUserByAliasOutput = User;

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
      throw new Error(`User with alias: ${alias.value}, not found`);
    }

    return user;
  }
}
