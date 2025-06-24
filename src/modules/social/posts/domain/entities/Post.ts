import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";
import { PostContent } from "../value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";

type PostProps = {
  authorId: Id<"UserId">;
  commentCount: number;
  likeCount: number;
  content: PostContent;
  images: ImageUrl[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class Post extends Entity<"PostId"> {
  protected constructor(
    private readonly postId: Id<"PostId">,
    private readonly props: PostProps,
  ) {
    super(postId, props.createdAt, props.updatedAt);
  }

  //#region getters methods
  get authorId(): Id<"UserId"> {
    return this.props.authorId;
  }

  get commentCount(): number {
    return this.props.commentCount;
  }

  get likeCount(): number {
    return this.props.likeCount;
  }

  get images(): ImageUrl[] {
    return [...this.props.images];
  }

  get content(): PostContent {
    return this.props.content;
  }
  //#endregion

  //#region update somethig
  updateContent(content: PostContent): void {
    this.props.content = content;
    this.touch();
  }
  //#endregion

  //#region add and remove something
  addImage(newImage: ImageUrl): void {
    const MAX_IMAGES = 5;

    if (this.props.images.length >= MAX_IMAGES) {
      throw new Error(
        `It is not possible to add more images. [MAX: ${MAX_IMAGES}]`,
      );
    }

    this.props.images.push(newImage);
    this.touch();
  }

  removeImage(image: ImageUrl): void {
    this.props.images = this.props.images.filter(
      (postImage) => !postImage.isEqual(image),
    );
    this.touch();
  }
  //#endregion

  //#region utils methods
  contentSummary(maxLength: number = 200): string {
    const summary = this.content.summary(maxLength);

    return summary.substring(0, maxLength).trimEnd();
  }
  //#endregion
}
