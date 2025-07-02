import { prisma } from "@/shared/infra/database/PrismaClient";
import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { PostMapper } from "../mappers/PostMapper";
import { injectable } from "tsyringe";
import { Id } from "@/shared/domain/value-objects/Id";

@injectable()
export class PrismaPostRepository implements IPostRepository {
  async save(post: Post): Promise<Post> {
    const newPost = await prisma.post.create({
      data: PostMapper.toPersistence(post),
    });

    return PostMapper.toDomain(newPost);
  }

  async findPostsByAuthorId(authorId: Id<"UserId">): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { authorId: authorId.value },
    });

    return posts.map((post) => PostMapper.toDomain(post));
  }
}
