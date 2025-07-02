import { PostLike as PrismaPostLike } from "generated/prisma";
import { PostLike } from "../../domain/entities/PostLike";
import { Id } from "@/shared/domain/value-objects/Id";

export class PostLikeMapper {
  static toDomain(persistedPostLike: PrismaPostLike): PostLike {
    const postId = Id.create<"PostId">({ value: persistedPostLike.postId });
    const userId = Id.create<"UserId">({ value: persistedPostLike.userId });

    const postLikeId = Id.create<"LikeId">({ value: persistedPostLike.id });

    return PostLike.create(
      {
        postId,
        userId,
        createdAt: persistedPostLike.createdAt,
        updatedAt: persistedPostLike.updatedAt,
      },
      postLikeId,
    );
  }

  static toPersistence(postLike: PostLike): PrismaPostLike {
    return {
      id: postLike.id.value,
      postId: postLike.postId.value,
      userId: postLike.userId.value,
      createdAt: postLike.createdAt,
      updatedAt: postLike.updatedAt,
    };
  }
}
