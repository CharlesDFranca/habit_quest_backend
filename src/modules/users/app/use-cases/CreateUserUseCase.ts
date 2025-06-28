import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IEnsureAliasIsUniqueService } from "../../domain/services/interfaces/IEnsureAliasIsUniqueService";
import { IEnsureEmailIsUniqueService } from "../../domain/services/interfaces/IEnsureEmailIsUniqueService";
import { IHashProvider } from "../interfaces/IHashProvider";
import { User } from "../../domain/entities/User";
import { Name } from "@/shared/domain/value-objects/Name";
import { Email } from "../../domain/value-objects/Email";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Password } from "../../domain/value-objects/Password";
import { Id } from "@/shared/domain/value-objects/Id";

type CreateUserInput = {
  name: string;
  email: string;
  alias: string;
  password: string;
};

type CreateUserOutput = { userId: Id<"UserId"> };

export class CreateUserUseCase
  implements IUseCase<CreateUserInput, CreateUserOutput>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly ensureAliasIsUniqueService: IEnsureAliasIsUniqueService,
    private readonly ensureEmailIsUniqueService: IEnsureEmailIsUniqueService,
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const name = Name.create({ value: input.name });
    const email = Email.create({ value: input.email });
    const alias = Alias.create({ value: input.alias });
    const password = Password.create({ value: input.password });

    await this.ensureEmailIsUniqueService.assertEmailIsUnique(email);
    await this.ensureAliasIsUniqueService.assertAliasIsUnique(alias);

    const hashedPassword = await this.hashProvider.hash(password.value);

    const passwordHash = Password.createFromHash({ value: hashedPassword });

    const user = User.create({ alias, email, name, password: passwordHash });

    await this.userRepository.save(user);

    return { userId: user.id };
  }
}
