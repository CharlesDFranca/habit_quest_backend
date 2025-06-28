import { Id } from "@/shared/domain/value-objects/Id";
import { Like } from "./Like";

type CommentLikeProps = {
  userId: Id<"UserId">;
  commentId: Id<"CommentId">;
  createdAt?: Date;
  updatedAt?: Date;
};

export class CommentLike extends Like {
  protected constructor(
    private readonly commentLikeId: Id<"LikeId">,
    private readonly commentLikeProps: CommentLikeProps,
  ) {
    super(commentLikeId, {
      userId: commentLikeProps.userId,
      createdAt: commentLikeProps.createdAt,
      updatedAt: commentLikeProps.updatedAt,
    });
  }

  static create(props: CommentLikeProps, _id?: Id<"LikeId">): CommentLike {
    const id = _id ?? Id.generate<"LikeId">();

    return new CommentLike(id, props);
  }

  get commentId(): Id<"CommentId"> {
    return this.commentLikeProps.commentId;
  }
}
