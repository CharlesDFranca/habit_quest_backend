export abstract class Entity {
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    private readonly _id: string,
    _createdAt?: Date,
    _updatedAt?: Date,
  ) {
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
}
