import { Post } from "../../domain/entities/Post";
import { PostDetailsDto } from "../dtos/PostDetailsDto";
import { PostIdDto } from "../dtos/PostIdDto";

export class PostMapper {
  private constructor() {}

  static toDetails(post: Post): PostDetailsDto {
    return {
      postId: post.id.value,
      authorId: post.authorId.value,
      content: post.content.value,
      commentCount: post.commentCount.value,
      likeCount: post.likeCount.value,
      images: post.images.map((image) => image.value),
      isPinned: post.isPinned,
      isPrivate: post.isPrivate,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static toId(post: Post): PostIdDto {
    return { postId: post.id.value };
  }
}
