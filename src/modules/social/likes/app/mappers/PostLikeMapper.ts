import { PostLike } from "../../domain/entities/PostLike";
import { PostLikeIdDto } from "../dtos/PostLikeIdDto";

export class PostLikeMapper {
  private constructor() {}

  static toId(postLike: PostLike): PostLikeIdDto {
    return {
      postLikeId: postLike.id.value,
    };
  }
}
