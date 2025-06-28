import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";

type LikeProps = {
  userId: Id<"UserId">;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class Like extends Entity<"LikeId"> {
  protected constructor(
    private readonly likeId: Id<"LikeId">,
    private readonly props: LikeProps,
  ) {
    super(likeId, props.createdAt, props.updatedAt);
  }

  //#region getters methods
  get userId(): Id<"UserId"> {
    return this.props.userId;
  }
  //#endregion
}
