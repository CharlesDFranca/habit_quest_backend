import { Comment } from "../entities/Comment";

export class CommentDomainService {
  static getCommentWithMostLikes(comments: Comment[]): Comment | null {
    if (comments.length === 0) return null;

    return [...comments].sort(
      (a, b) => b.likeCount.value - a.likeCount.value,
    )[0];
  }
}
