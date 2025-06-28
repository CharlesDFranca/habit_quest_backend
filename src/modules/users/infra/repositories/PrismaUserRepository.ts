import { Alias } from "@/shared/domain/value-objects/Alias";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/value-objects/Email";

import { PrismaClientSingleton } from "@/shared/infra/database/PrismaClientSingleton";
import { UserMapper } from "../mappers/UserMapper";

export class PrismaUserRepository implements IUserRepository {
  private prisma = PrismaClientSingleton.getInstance();

  async save(user: User): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(newUser);
  }

  async findUserByAlias(alias: Alias): Promise<User | null> {
    const userExists = await this.prisma.user.findUnique({
      where: { alias: alias.value },
    });

    if (!userExists) return null;

    return UserMapper.toDomain(userExists);
  }

  async findUserByEmail(email: Email): Promise<User | null> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: email.value },
    });

    if (!userExists) return null;

    return UserMapper.toDomain(userExists);
  }
}
