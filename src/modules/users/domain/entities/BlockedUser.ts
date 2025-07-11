import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";

type BlockedUserProps = {
  blockerId: Id<"UserId">;
  blockedId: Id<"UserId">;
  createdAt?: Date;
  updatedAt?: Date;
};

export class BlockedUser extends Entity<"BlockedUserId"> {
  private constructor(
    private readonly blockedUserId: Id<"BlockedUserId">,
    private readonly props: BlockedUserProps,
  ) {
    super(blockedUserId);
  }

  static create(
    props: BlockedUserProps,
    _id?: Id<"BlockedUserId">,
  ): BlockedUser {
    const id = _id ?? Id.generate<"BlockedUserId">();
    return new BlockedUser(id, props);
  }

  get blockerId(): Id<"UserId"> {
    return this.props.blockerId;
  }

  get blockedId(): Id<"UserId"> {
    return this.props.blockedId;
  }
}
