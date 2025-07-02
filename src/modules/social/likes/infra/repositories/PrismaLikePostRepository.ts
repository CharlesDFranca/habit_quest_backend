import { Id } from "@/shared/domain/value-objects/Id";
import { PostLike } from "../../domain/entities/PostLike";
import { IPostLikeRepository } from "../../domain/repositories/IPostLikeRepository";
import { prisma } from "@/shared/infra/database/PrismaClient";
import { PostLikeMapper } from "../mappers/PostLikeMapper";
import { injectable } from "tsyringe";

@injectable()
export class PrismaPostLikeRepository implements IPostLikeRepository {
  async save(postLike: PostLike): Promise<PostLike> {
    const postLiked = await prisma.postLike.create({
      data: PostLikeMapper.toPersistence(postLike),
    });

    return PostLikeMapper.toDomain(postLiked);
  }

  async findLikeByUserIdAndPostId(
    userId: Id<"UserId">,
    postId: Id<"PostId">,
  ): Promise<PostLike | null> {
    const like = await prisma.postLike.findUnique({
      where: { userId: userId.value, postId: postId.value },
    });

    if (!like) return null;

    return PostLikeMapper.toDomain(like);
  }
}
