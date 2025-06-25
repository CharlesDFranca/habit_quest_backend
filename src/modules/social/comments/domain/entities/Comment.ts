import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";
import { CommentContent } from "../value-object/CommentContent";
import { Counter } from "@/shared/domain/value-objects/Counter";

type CommentProps = {
  authorId: Id<"UserId">;
  postId: Id<"PostId">;
  content: CommentContent;
  replyCount: Counter;
  likeCount: Counter;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Comment extends Entity<"CommentId"> {
  private constructor(
    private readonly commentId: Id<"CommentId">,
    private readonly props: CommentProps,
  ) {
    super(commentId, props.createdAt, props.updatedAt);
  }

  static create(props: CommentProps, _id?: Id<"CommentId">): Comment {
    const id = _id ?? Id.generate<"CommentId">();
    return new Comment(id, props);
  }

  //#region getter methods
  get authorId(): Id<"UserId"> {
    return this.props.authorId;
  }

  get postId(): Id<"PostId"> {
    return this.props.postId;
  }

  get content(): CommentContent {
    return this.props.content;
  }

  get replyCount(): Counter {
    return this.props.replyCount;
  }

  get likeCount(): Counter {
    return this.props.likeCount;
  }
  //#endregion

  //#region update something methods
  updateContent(content: CommentContent): void {
    this.props.content = content;
    this.touch();
  }

  //#endregion

  //#region add and remove something methods
  increaseLikeCount(amount?: number): void {
    this.props.likeCount = amount
      ? this.likeCount.incrementBy(amount)
      : this.likeCount.incrementByOne();
    this.touch();
  }

  decreaseLikeCount(amount?: number): void {
    this.props.likeCount = amount
      ? this.likeCount.decrementBy(amount)
      : this.likeCount.decrementByOne();
    this.touch();
  }

  increaseReplyCount(amount?: number): void {
    this.props.replyCount = amount
      ? this.replyCount.incrementBy(amount)
      : this.replyCount.incrementByOne();
    this.touch();
  }

  decreaseReplyCount(amount?: number): void {
    this.props.replyCount = amount
      ? this.replyCount.decrementBy(amount)
      : this.replyCount.decrementByOne();
    this.touch();
  }
  //#endregion

  //#region utils methods
  contentSummary(maxLength: number = 50): string {
    const summary = this.content.summary(maxLength);

    return summary.substring(0, maxLength).trimEnd();
  }
  //#endregion
}
