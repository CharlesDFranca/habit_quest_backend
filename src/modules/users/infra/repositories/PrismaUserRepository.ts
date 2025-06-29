import { Alias } from "@/shared/domain/value-objects/Alias";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/value-objects/Email";

import { UserMapper } from "../mappers/UserMapper";

import { prisma } from "@/shared/infra/database/PrismaClient";
import { injectable } from "tsyringe";
import { Id } from "@/shared/domain/value-objects/Id";

@injectable()
export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    const newUser = await prisma.user.create({
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(newUser);
  }

  async findUserByAlias(alias: Alias): Promise<User | null> {
    const userExists = await prisma.user.findUnique({
      where: { alias: alias.value },
    });

    if (!userExists) return null;

    return UserMapper.toDomain(userExists);
  }

  async findUserByEmail(email: Email): Promise<User | null> {
    const userExists = await prisma.user.findUnique({
      where: { email: email.value },
    });

    if (!userExists) return null;

    return UserMapper.toDomain(userExists);
  }

  async findUserById(id: Id<"UserId">): Promise<User | null> {
    const userExists = await prisma.user.findUnique({
      where: { id: id.value },
    });

    if (!userExists) return null;

    return UserMapper.toDomain(userExists);
  }
}
