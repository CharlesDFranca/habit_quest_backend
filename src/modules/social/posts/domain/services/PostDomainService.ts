import { Post } from "../entities/Post";

export class PostDomainService {
  static getPinnedPosts(posts: Post[]): Post[] {
    return posts.filter((post) => post.isPinned);
  }

  static getPublicPosts(posts: Post[]): Post[] {
    return posts.filter((post) => !post.isPrivate);
  }

  static sortPostsByMostLikes(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => b.likeCount.value - a.likeCount.value);
  }

  static sortPostsByCreatedAt(posts: Post[]): Post[] {
    return [...posts].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }
}
