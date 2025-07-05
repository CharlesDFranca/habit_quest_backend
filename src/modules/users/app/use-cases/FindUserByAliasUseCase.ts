import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { UserNotFoundException } from "../errors/UserNotFoundException";
import { UserDetailsDto } from "../dtos/UserDetailsDTO";
import { UserMapper } from "../mappers/UserMapper";

type FindUserByAliasInput = { alias: string };

type FindUserByAliasOutput = UserDetailsDto;

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
        `User not found by alias: ${alias.value}`,
      );
    }

    return UserMapper.toDetails(user);
  }
}
