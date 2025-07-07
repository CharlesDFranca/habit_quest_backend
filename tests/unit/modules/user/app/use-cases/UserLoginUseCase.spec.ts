import "reflect-metadata";
import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import { UserLoginUseCase } from "@/modules/users/app/use-cases/UserLoginUseCase";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { ITokenProvider } from "@/shared/app/interfaces/ITokenProvider";
import { IHashProvider } from "@/modules/users/app/interfaces/IHashProvider";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Password } from "@/modules/users/domain/value-objects/Password";
import { User } from "@/modules/users/domain/entities/User";
import { Id } from "@/shared/domain/value-objects/Id";
import { InvalidCredentialsException } from "@/modules/users/app/errors/InvalidCredentialsException";

describe("UserLoginUseCase", () => {
  let userRepository: IUserRepository;
  let tokenProvider: ITokenProvider;
  let hashProvider: IHashProvider;
  let useCase: UserLoginUseCase;

  const validEmail = "example@domain.com";
  const validPassword = "StrongPassword123!";
  const hashedPassword = "$hashed_password";
  const fakeToken = "jwt.token.here";

  const user = User.create(
    {
      email: Email.create({ value: validEmail }),
      name: Name.create({ value: "Test User" }),
      alias: Alias.create({ value: "test" }),
      password: Password.createFromHash({ value: hashedPassword }),
    },
    Id.generate<"UserId">(),
  );

  beforeEach(() => {
    userRepository = {
      findUserByEmail: vi.fn().mockResolvedValue(user),
    } as unknown as IUserRepository;

    tokenProvider = {
      generate: vi.fn().mockReturnValue(fakeToken),
    } as unknown as ITokenProvider;

    hashProvider = {
      compare: vi.fn().mockResolvedValue(true),
    } as unknown as IHashProvider;

    useCase = new UserLoginUseCase(userRepository, tokenProvider, hashProvider);
  });

  it("should authenticate user with valid credentials", async () => {
    const result = await useCase.execute({
      email: validEmail,
      password: validPassword,
    });

    expect(result.token).toBe(fakeToken);
    expect(userRepository.findUserByEmail).toHaveBeenCalledOnce();
    expect(hashProvider.compare).toHaveBeenCalledWith(
      validPassword,
      user.password.value,
    );
    expect(tokenProvider.generate).toHaveBeenCalledWith({
      sub: user.id.value,
    });
  });

  it("should throw InvalidCredentialsException if email is not found", async () => {
    (userRepository.findUserByEmail as Mock).mockResolvedValue(null);

    await expect(() =>
      useCase.execute({ email: validEmail, password: validPassword }),
    ).rejects.toThrow(InvalidCredentialsException);

    expect(hashProvider.compare).not.toHaveBeenCalled();
    expect(tokenProvider.generate).not.toHaveBeenCalled();
  });

  it("should throw InvalidCredentialsException if password is incorrect", async () => {
    (hashProvider.compare as Mock).mockResolvedValue(false);

    await expect(() =>
      useCase.execute({ email: validEmail, password: validPassword }),
    ).rejects.toThrow(InvalidCredentialsException);

    expect(userRepository.findUserByEmail).toHaveBeenCalledOnce();
    expect(tokenProvider.generate).not.toHaveBeenCalled();
  });
});
