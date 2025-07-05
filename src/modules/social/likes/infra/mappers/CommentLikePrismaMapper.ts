import { CommentLike as PrismaCommentLike } from "generated/prisma";
import { CommentLike } from "../../domain/entities/CommentLike";
import { Id } from "@/shared/domain/value-objects/Id";

export class CommentLikePrismaMapper {
  static toDomain(persistedCommentLike: PrismaCommentLike): CommentLike {
    const commentId = Id.create<"CommentId">({
      value: persistedCommentLike.commentId,
    });
    const userId = Id.create<"UserId">({ value: persistedCommentLike.userId });

    const commentLikeId = Id.create<"LikeId">({
      value: persistedCommentLike.id,
    });

    return CommentLike.create(
      {
        commentId,
        userId,
        createdAt: persistedCommentLike.createdAt,
        updatedAt: persistedCommentLike.updatedAt,
      },
      commentLikeId,
    );
  }

  static toPersistence(commentLike: CommentLike): PrismaCommentLike {
    return {
      id: commentLike.id.value,
      commentId: commentLike.commentId.value,
      userId: commentLike.userId.value,
      createdAt: commentLike.createdAt,
      updatedAt: commentLike.updatedAt,
    };
  }
}
