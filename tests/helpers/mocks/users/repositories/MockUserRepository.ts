import { User } from "@/modules/users/domain/entities/User";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { fakeUsersArray } from "../fakes/FakeUsersArray";
import { Id } from "@/shared/domain/value-objects/Id";
import { FakeUserFactory } from "../fakes/FakeUserFactory";

const fixedUsers = [
  FakeUserFactory.createUser({
    alias: "ToBeError",
    email: "email@domain.com",
    name: "Name",
    password: "(Pass1234)",
  }),
  FakeUserFactory.createUser(
    {
      alias: "ToBePass",
      email: "email@domain.com",
      name: "Name",
      password: "(Pass1234)",
    },
    Id.create<"UserId">({
      value: "370c66b1-c45d-447d-965f-5d1579cb4857",
    }),
  ),
];

export class MockUserRepository implements IUserRepository {
  async findUserByAlias(alias: Alias): Promise<User | null> {
    const fakeUsers = [...fakeUsersArray, ...fixedUsers];

    const user = fakeUsers.find((user) => user.alias.isEqual(alias));

    if (!user) return null;

    return user;
  }
}
