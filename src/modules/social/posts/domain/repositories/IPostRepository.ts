import { Post } from "../entities/Post";

export interface IPostRepository {
  save(post: Post): Promise<Post>;
}
