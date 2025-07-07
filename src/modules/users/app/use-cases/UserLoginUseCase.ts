import { IUseCase } from "@/shared/app/interfaces/IUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ITokenProvider } from "@/shared/app/interfaces/ITokenProvider";
import { IHashProvider } from "../interfaces/IHashProvider";
import { inject, injectable } from "tsyringe";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { InvalidCredentialsException } from "../errors/InvalidCredentialsException";
import { LoginResponseDto } from "../dtos/LoginResponseDto";

type UserLoginInput = {
  email: string;
  password: string;
};

type UserLoginOutput = LoginResponseDto;

@injectable()
export class UserLoginUseCase
  implements IUseCase<UserLoginInput, UserLoginOutput>
{
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository,
    @inject("TokenProvider")
    private readonly tokenProvider: ITokenProvider,
    @inject("HashProvider")
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute(input: UserLoginInput): Promise<UserLoginOutput> {
    const email = Email.create({ value: input.email });
    const password = Password.create({ value: input.password });

    const userExists = await this.userRepository.findUserByEmail(email);

    if (!userExists) {
      throw new InvalidCredentialsException();
    }

    const isPasswordCorrect = await this.hashProvider.compare(
      password.value,
      userExists.password.value,
    );

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsException();
    }

    const token = this.tokenProvider.generate({ sub: userExists.id.value });

    return { token };
  }
}
