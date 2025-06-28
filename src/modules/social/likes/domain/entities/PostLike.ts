import { Id } from "@/shared/domain/value-objects/Id";
import { Like } from "./Like";

type PostLikeProps = {
  userId: Id<"UserId">;
  postId: Id<"PostId">;
  createdAt?: Date;
  updatedAt?: Date;
};

export class PostLike extends Like {
  protected constructor(
    private readonly postLikeId: Id<"LikeId">,
    private readonly postLikeProps: PostLikeProps,
  ) {
    super(postLikeId, {
      userId: postLikeProps.userId,
      createdAt: postLikeProps.createdAt,
      updatedAt: postLikeProps.updatedAt,
    });
  }

  static create(props: PostLikeProps, _id?: Id<"LikeId">): PostLike {
    const id = _id ?? Id.generate<"LikeId">();

    return new PostLike(id, props);
  }

  get postId(): Id<"PostId"> {
    return this.postLikeProps.postId;
  }
}
