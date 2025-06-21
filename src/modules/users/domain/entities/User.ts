import { Entity } from "@/shared/domain/entities/Entity";
import { Email } from "../value-objects/Email";
import { Name } from "@/shared/domain/value-objects/Name";
import { Alias } from "@/shared/domain/value-objects/Alias";
import { Password } from "../value-objects/Password";

type UserProps = {
  name: Name;
  alias: Alias;
  email: Email;
  password: Password;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User extends Entity {
  private constructor(
    private readonly userId: string,
    private readonly props: UserProps,
  ) {
    super(userId, props.createdAt, props.updatedAt);
  }

  static create(id: string, props: UserProps): User {
    return new User(id, props);
  }

  //#region getters methods
  get name(): Name {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get alias(): Alias {
    return this.props.alias;
  }

  get password(): Password {
    return this.props.password;
  }
  //#endregion

  //#region change methods
  updateName(name: Name): void {
    this.props.name = name;
    this.touch();
  }

  updateAlias(alias: Alias): void {
    this.props.alias = alias;
    this.touch();
  }

  updateEmail(email: Email): void {
    this.props.email = email;
    this.touch();
  }

  updatePassword(password: Password): void {
    this.props.password = password;
    this.touch();
  }
  //#endregion
}
