import { prisma } from "@/shared/infra/database/PrismaClient";
import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { PostMapper } from "../mappers/PostMapper";

export class PrismaPostRepository implements IPostRepository {
  async save(post: Post): Promise<Post> {
    const newPost = await prisma.post.create({
      data: PostMapper.toPersistence(post),
    });

    return PostMapper.toDomain(newPost);
  }
}
