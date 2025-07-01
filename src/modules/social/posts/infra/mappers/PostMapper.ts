import { Post as PostPrisma } from "generated/prisma";
import { Id } from "@/shared/domain/value-objects/Id";
import { Post } from "../../domain/entities/Post";
import { PostContent } from "../../domain/value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { Counter } from "@/shared/domain/value-objects/Counter";

export class PostMapper {
  private constructor() {}

  static toDomain(postPersistedData: PostPrisma): Post {
    const id = Id.create<"PostId">({ value: postPersistedData.id });

    const content = PostContent.create({ value: postPersistedData.content });
    const authorId = Id.create<"UserId">({ value: postPersistedData.authorId });
    const images: ImageUrl[] = postPersistedData.images.map((image) =>
      ImageUrl.create({ value: image }),
    );
    const commentCount = Counter.create({
      value: postPersistedData.commentCount,
    });
    const likeCount = Counter.create({ value: postPersistedData.likeCount });

    return Post.create(
      {
        content,
        authorId,
        commentCount,
        images,
        likeCount,
        isPinned: postPersistedData.isPinned,
        isPrivate: postPersistedData.isPrivate,
        createdAt: postPersistedData.createdAt,
        updatedAt: postPersistedData.updatedAt,
      },
      id,
    );
  }

  static toPersistence(post: Post) {
    return {
      id: post.id.value,
      content: post.content.value,
      authorId: post.authorId.value,
      commentCount: post.commentCount.value,
      likeCount: post.likeCount.value,
      images: post.images.map((imageUrl) => imageUrl.value),
      isPinned: post.isPinned,
      isPrivate: post.isPrivate,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    } as PostPrisma;
  }
}
