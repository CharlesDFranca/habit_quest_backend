import { InvalidValueObjectException } from "../errors/InvalidValueObjectException";
import { IdGenerator } from "../services/IdGenerator";
import { IIdGenerator } from "../services/intefaces/IIdGenerator";
import { ValueObject } from "./ValueObject";

export type IdType =
  | "UserId"
  | "PostId"
  | "CommentId"
  | "LikeId"
  | "BlockedUserId";

type IdProps = { value: string };

export class Id<T extends IdType> extends ValueObject<IdProps> {
  private readonly __brand!: T;

  static create<T extends IdType>(props: IdProps): Id<T> {
    return new Id<T>(props);
  }

  static generate<T extends IdType>(
    idGenerator: IIdGenerator = new IdGenerator(),
  ): Id<T> {
    return new Id<T>({ value: idGenerator.generate() });
  }

  protected validate(props: IdProps): boolean {
    const id = props.value.trim();

    if (id.length === 0) {
      throw new InvalidValueObjectException("Id cannot be empty");
    }

    const ID_REGEX =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!ID_REGEX.test(id)) {
      throw new InvalidValueObjectException(
        "Invalid Id format. Id must be a UUID.",
      );
    }

    return true;
  }

  get value(): string {
    return this.props.value;
  }
}
