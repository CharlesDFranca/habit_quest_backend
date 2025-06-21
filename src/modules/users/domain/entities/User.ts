import { Entity } from "@/shared/domain/entities/Entity";
import { Email } from "../value-objects/Email";

type UserProps = {
  name: string;
  email: Email;
  alias: string;
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
  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get alias(): string {
    return this.props.alias;
  }
  //#endregion

  //#region change methods
  updateName(name: string): void {
    this.props.name = name;
    this.touch();
  }

  updateAlias(alias: string): void {
    this.props.alias = alias;
    this.touch();
  }

  updateEmail(email: Email): void {
    this.props.email = email;
    this.touch();
  }
  //#endregion
}
