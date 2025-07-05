import { Id } from "@/shared/domain/value-objects/Id";
import { CommentLike } from "../../domain/entities/CommentLike";
import { ICommentLikeRepository } from "../../domain/repositories/ICommentLikeRepository";
import { prisma } from "@/shared/infra/database/PrismaClient";
import { CommentLikePrismaMapper } from "../mappers/CommentLikePrismaMapper";
import { injectable } from "tsyringe";

@injectable()
export class PrismaCommentLikeRepository implements ICommentLikeRepository {
  async save(commentLike: CommentLike): Promise<CommentLike> {
    const commentLiked = await prisma.commentLike.create({
      data: CommentLikePrismaMapper.toPersistence(commentLike),
    });

    return CommentLikePrismaMapper.toDomain(commentLiked);
  }

  async findLikeByUserIdAndCommentId(
    userId: Id<"UserId">,
    commentId: Id<"CommentId">,
  ): Promise<CommentLike | null> {
    const like = await prisma.commentLike.findUnique({
      where: { userId: userId.value, commentId: commentId.value },
    });

    if (!like) return null;

    return CommentLikePrismaMapper.toDomain(like);
  }
}
