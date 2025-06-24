import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";
import { PostContent } from "../value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";

type PostProps = {
  authorId: Id<"UserId">;
  commentIds: Id<"CommentId">[];
  likeIds: Id<"LikeId">[];
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

  get commentIds(): Id<"CommentId">[] {
    return [...this.props.commentIds];
  }

  get likeIds(): Id<"LikeId">[] {
    return [...this.props.likeIds];
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

  private updateImages(images: ImageUrl[]): void {
    this.props.images = images;
    this.touch();
  }
  //#endregion

  //#region add and remove something
  addImage(image: ImageUrl): void {
    const MAX_IMAGES = 5;

    if (this.props.images.length >= MAX_IMAGES) {
      throw new Error(
        `It is not possible to add more images. [MAX: ${MAX_IMAGES}]`,
      );
    }

    const newImages = [...this.props.images, image];

    this.updateImages(newImages);
  }

  removeImage(image: ImageUrl): void {
    const filteredImages = this.props.images.filter(
      (postImage) => !postImage.isEqual(image),
    );

    this.updateImages(filteredImages);
  }
  //#endregion

  //#region utils methods
  contentSummary(maxLength: number = 200): string {
    const summary = this.content.summary(maxLength);

    return summary.substring(0, maxLength).trimEnd();
  }
  //#endregion
}
