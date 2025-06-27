import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IEnsureAliasIsUniqueService } from "../../domain/services/interfaces/IEnsureAliasIsUniqueService";
import { IEnsureEmailIsUniqueService } from "../../domain/services/interfaces/IEnsureEmailIsUniqueService";
import { Name } from "@/shared/domain/value-objects/Name";
import { Email } from "../../domain/value-objects/Email";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Password } from "../../domain/value-objects/Password";

type CreateUserInput = {
  name: string;
  email: string;
  alias: string;
  password: string;
};

type CreateUserOutput = { userId: string };

export class CreateUserUseCase
  implements IUseCase<CreateUserInput, CreateUserOutput>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly ensureAliasIsUniqueService: IEnsureAliasIsUniqueService,
    private readonly ensureEmailIsUniqueService: IEnsureEmailIsUniqueService,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const name = Name.create({ value: input.name });
    const email = Email.create({ value: input.email });
    const alias = Alias.create({ value: input.alias });
    const password = Password.create({ value: input.password });

    await this.ensureEmailIsUniqueService.assertEmailIsUnique(email);
    await this.ensureAliasIsUniqueService.assertAliasIsUnique(alias);

    const user = User.create({ alias, email, name, password });

    if (!user.id) {
      throw new Error("User id is required");
    }

    await this.userRepository.save(user);

    return { userId: user.id.value };
  }
}
