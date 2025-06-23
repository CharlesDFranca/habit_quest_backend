import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";
import { CommentContent } from "../value-object/CommentContent";

type CommentProps = {
  authorId: Id<"UserId">;
  postId: Id<"PostId">;
  content: CommentContent;
  replyIds: Id<"CommentId">[];
  likeIds: Id<"LikeId">[];
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

  get replyIds(): Id<"CommentId">[] {
    return [...this.props.replyIds];
  }

  get likeIds(): Id<"LikeId">[] {
    return [...this.props.likeIds];
  }
  //#endregion

  //#region update something methods
  updateContent(content: CommentContent): void {
    this.props.content = content;
    this.touch();
  }

  private updateLikeIds(likeIds: Id<"LikeId">[]): void {
    this.props.likeIds = likeIds;
    this.touch();
  }

  private updateReplyIds(replyIds: Id<"CommentId">[]): void {
    this.props.replyIds = replyIds;
    this.touch();
  }
  //#endregion

  //#region add and remove something methods
  addLikeId(likeId: Id<"LikeId">): void {
    const alreadLike = this.props.likeIds.some((commentLikeId) =>
      commentLikeId.isEqual(likeId),
    );

    if (alreadLike) return;

    const newLikeIds = [...this.props.likeIds, likeId];

    this.updateLikeIds(newLikeIds);
  }

  removeLikeId(likeId: Id<"LikeId">): void {
    if (!this.props.likeIds.includes(likeId)) return;

    const newLikeIds = this.props.likeIds.filter(
      (commentLikeId) => !commentLikeId.isEqual(likeId),
    );

    this.updateLikeIds(newLikeIds);
  }

  addReplyId(replyId: Id<"CommentId">): void {
    const alreadyReplied = this.props.replyIds.some((commentReplyId) =>
      commentReplyId.isEqual(replyId),
    );

    if (alreadyReplied) return;

    const newReplyIds = [...this.props.replyIds, replyId];

    this.updateReplyIds(newReplyIds);
  }

  removeReplyId(replyId: Id<"CommentId">): void {
    if (!this.props.replyIds.includes(replyId)) return;

    const newReplyIds = this.props.replyIds.filter(
      (commentReplyId) => !commentReplyId.isEqual(replyId),
    );

    this.updateReplyIds(newReplyIds);
  }
  //#endregion

  //#region utils methods
  contentSummary(maxLength: number = 50): string {
    const summary = this.content.summary(maxLength);

    const dots = "...";

    return summary.substring(0, maxLength - dots.length).trimEnd() + dots;
  }
  //#endregion
}
