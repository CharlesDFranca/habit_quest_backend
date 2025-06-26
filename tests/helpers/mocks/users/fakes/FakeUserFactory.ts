import { User } from "@/modules/users/domain/entities/User";
import { Email } from "@/modules/users/domain/value-objects/Email";
import { Password } from "@/modules/users/domain/value-objects/Password";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Id } from "@/shared/domain/value-objects/Id";
import { Name } from "@/shared/domain/value-objects/Name";

type FakeUserProps = {
  name: string;
  alias: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class FakeUserFactory {
  static createUser(props: FakeUserProps, _id?: Id<"UserId">): User {
    const id = _id ?? Id.generate<"UserId">();

    return User.create(
      {
        name: Name.create({ value: props.name }),
        alias: Alias.create({ value: props.alias }),
        email: Email.create({ value: props.email }),
        password: Password.create({ value: props.password }),
      },
      id,
    );
  }
}
