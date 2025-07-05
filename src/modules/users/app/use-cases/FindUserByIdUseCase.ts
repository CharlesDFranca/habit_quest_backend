import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { Id } from "@/shared/domain/value-objects/Id";
import { UserNotFoundException } from "../errors/UserNotFoundException";
import { UserDetailsDto } from "../dtos/UserDetailsDTO";
import { UserMapper } from "../mappers/UserMapper";

type FindUserByIdInput = { userId: string };

type FindUserByIdOutput = UserDetailsDto;

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
      throw new UserNotFoundException(`User not found by "id": ${id.value}`);
    }

    return UserMapper.toDetails(user);
  }
}
