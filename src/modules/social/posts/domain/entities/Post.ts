import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";
import { PostContent } from "../value-objects/PostContent";
import { ImageUrl } from "@/shared/domain/value-objects/ImageUrl";
import { Counter } from "@/shared/domain/value-objects/Counter";

type PostProps = {
  authorId: Id<"UserId">;
  commentCount: Counter;
  likeCount: Counter;
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

  static create(props: PostProps, _id?: Id<"PostId">): Post {
    const id = _id ?? Id.generate<"PostId">();
    return new Post(id, {
      ...props,
      likeCount: props.likeCount ?? Counter.create({ value: 0 }),
      commentCount: props.commentCount ?? Counter.create({ value: 0 }),
    });
  }

  //#region getters methods
  get authorId(): Id<"UserId"> {
    return this.props.authorId;
  }

  get commentCount(): Counter {
    return this.props.commentCount;
  }

  get likeCount(): Counter {
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
    if (this.content.isEqual(content)) return;
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

  increaseLikeCount(amount: number = 1): void {
    this.props.likeCount = amount
      ? this.likeCount.incrementBy(amount)
      : this.likeCount.incrementByOne();
  }

  decreaseLikeCount(amount: number = 1): void {
    this.props.likeCount = amount
      ? this.likeCount.decrementBy(amount)
      : this.likeCount.decrementByOne();
  }

  increaseCommentCount(amount: number = 1): void {
    this.props.commentCount = amount
      ? this.commentCount.incrementBy(amount)
      : this.commentCount.incrementByOne();
  }

  decreaseCommentCount(amount: number = 1): void {
    this.props.commentCount = amount
      ? this.commentCount.decrementBy(amount)
      : this.commentCount.decrementByOne();
  }
}
