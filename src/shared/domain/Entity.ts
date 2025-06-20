export abstract class Entity {
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    private readonly _id: string,
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

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return new Date(this._createdAt.getTime());
  }

  get updatedAt(): Date | undefined {
    return new Date(this._updatedAt.getTime());
  }

  protected touch() {
    this._updatedAt = new Date();
  }

  isEqual(other: Entity): boolean {
    return this.id == other.id;
  }
}
