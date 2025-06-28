import { User as UserPrisma } from "generated/prisma";
import { User } from "../../domain/entities/User";
import { Id } from "@/shared/domain/value-objects/Id";
import { Name } from "@/shared/domain/value-objects/Name";
import { Email } from "../../domain/value-objects/Email";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Password } from "../../domain/value-objects/Password";

export class UserMapper {
  private constructor() {}

  static toDomain(userPersistedData: UserPrisma) {
    const id = Id.create<"UserId">({ value: userPersistedData.id });

    const email = Email.create({ value: userPersistedData.email });
    const alias = Alias.create({ value: userPersistedData.alias });
    const password = Password.createFromHash({
      value: userPersistedData.password,
    });
    const name = Name.create({ value: userPersistedData.name });

    return User.create(
      {
        name,
        alias,
        email,
        password,
        createdAt: userPersistedData.createdAt,
        updatedAt: userPersistedData.updatedAt,
      },
      id,
    );
  }

  static toPersistence(user: User) {
    return {
      id: user.id.value,
      alias: user.alias.value,
      email: user.email.value,
      name: user.name.value,
      password: user.password.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserPrisma;
  }
}
