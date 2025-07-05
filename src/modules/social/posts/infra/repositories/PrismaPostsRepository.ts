import { prisma } from "@/shared/infra/database/PrismaClient";
import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { PostPrimaMapper } from "../mappers/PostPrismaMapper";
import { injectable } from "tsyringe";
import { Id } from "@/shared/domain/value-objects/Id";

@injectable()
export class PrismaPostRepository implements IPostRepository {
  async save(post: Post): Promise<Post> {
    const newPost = await prisma.post.create({
      data: PostPrimaMapper.toPersistence(post),
    });

    return PostPrimaMapper.toDomain(newPost);
  }

  async update(post: Post): Promise<void> {
    await prisma.post.update({
      where: { id: post.id.value },
      data: PostPrimaMapper.toPersistence(post),
    });
  }

  async findPostsByAuthorId(authorId: Id<"UserId">): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { authorId: authorId.value },
    });

    return posts.map((post) => PostPrimaMapper.toDomain(post));
  }

  async findPostById(postId: Id<"PostId">): Promise<Post | null> {
    const post = await prisma.post.findUnique({ where: { id: postId.value } });

    if (!post) return null;

    return PostPrimaMapper.toDomain(post);
  }

  async findLikedPostsByUserId(userId: Id<"UserId">): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { likes: { some: { userId: userId.value } } },
    });

    return posts.map((post) => PostPrimaMapper.toDomain(post));
  }
}
