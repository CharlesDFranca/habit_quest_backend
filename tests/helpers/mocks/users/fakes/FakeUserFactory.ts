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
  static createUser(props?: FakeUserProps, _id?: Id<"UserId">): User {
    const id = _id ?? Id.generate<"UserId">();

    const userProps: FakeUserProps = {
      alias: props && props.alias ? props?.alias : "user_alias",
      email: props && props.email ? props?.email : "user@domain.com",
      name: props && props.name ? props?.name : "user",
      password: props && props.password ? props?.password : "Pass123!",
      createdAt: props && props.createdAt ? props?.createdAt : new Date(),
      updatedAt: props && props.updatedAt ? props?.updatedAt : new Date(),
    };

    return User.create(
      {
        name: Name.create({ value: userProps.name }),
        alias: Alias.create({ value: userProps.alias }),
        email: Email.create({ value: userProps.email }),
        password: Password.create({ value: userProps.password }),
        createdAt: userProps.createdAt,
        updatedAt: userProps.updatedAt,
      },
      id,
    );
  }
}
