import { Id, IdType } from "../value-objects/Id";

export abstract class Entity<T extends IdType> {
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    private readonly _id?: Id<T>,
    _createdAt?: Date,
    _updatedAt?: Date,
  ) {
    if (
      _createdAt !== undefined &&
      _updatedAt !== undefined &&
      _createdAt.getTime() > _updatedAt.getTime()
    ) {
      throw new Error("Entity creation date cannot be after updated date");
    }

    this._createdAt = _createdAt ?? new Date();
    this._updatedAt = _updatedAt ?? new Date();
  }

  get id(): Id<T> | undefined {
    return this._id;
  }

  get createdAt(): Date {
    return new Date(this._createdAt.getTime());
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt.getTime());
  }

  protected touch() {
    this._updatedAt = new Date();
  }

  isEqual(other: Entity<T>): boolean {
    return this.id == other.id;
  }
}
