import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";

type LikeableType = "Post" | "Comment";

type LikeProps = {
  userId: Id<"UserId">;
  likeableId: Id<"PostId"> | Id<"CommentId">;
  likeableType: LikeableType;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Like extends Entity<"LikeId"> {
  private constructor(
    private readonly likeId: Id<"LikeId">,
    private readonly props: LikeProps,
  ) {
    super(likeId, props.createdAt, props.updatedAt);
  }

  static create(props: LikeProps, _id: Id<"LikeId">): Like {
    const id = _id ?? Id.generate<"LikeId">();

    return new Like(id, props);
  }

  //#region getters methods
  get userId(): Id<"UserId"> {
    return this.props.userId;
  }

  get likeableId(): Id<"PostId"> | Id<"CommentId"> {
    return this.props.likeableId;
  }

  get likeableType(): LikeableType {
    return this.props.likeableType;
  }
  //#endregion
}
