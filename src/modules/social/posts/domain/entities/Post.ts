import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";
import { PostContent } from "../value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";

type PostPros = {
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
    private readonly props: PostPros,
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
  contentSummary(maxLength: number = 20): string {
    const MIN_LENGTH_FOR_SUMMARY = 10;

    if (maxLength < MIN_LENGTH_FOR_SUMMARY) {
      throw new Error(
        `The maximum length must be at least ${MIN_LENGTH_FOR_SUMMARY} to allow for a meaningful summary`,
      );
    }

    const content = this.content.value.trim();

    if (content.length <= maxLength) return content;

    const dots = "...";

    return content.substring(0, maxLength - dots.length).trimEnd() + dots;
  }

  getElapsedTimeSinceCreation(): string {
    const now = new Date();
    const diffMs = now.getTime() - this.createdAt.getTime();

    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    const ONE_MINUTE = 1;
    const MINUTES_IN_ONE_HOUR = 60;
    const HOURS_IN_ONE_DAY = 24;
    const DAYS_IN_ONE_YEAR = 365;

    if (diffMinutes < ONE_MINUTE) {
      return "Right now";
    }

    if (diffMinutes < MINUTES_IN_ONE_HOUR) {
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    }

    const diffHours = Math.floor(diffMinutes / MINUTES_IN_ONE_HOUR);
    if (diffHours < HOURS_IN_ONE_DAY) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }

    const diffDays = Math.floor(diffHours / HOURS_IN_ONE_DAY);
    if (diffDays < DAYS_IN_ONE_YEAR) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }

    const diffYears = Math.floor(diffDays / DAYS_IN_ONE_YEAR);
    return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
  }

  //#endregion
}
