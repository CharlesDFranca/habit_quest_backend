import { Entity } from "@/shared/domain/entities/Entity";
import { Id } from "@/shared/domain/value-objects/Id";

type BlockedUserProps = {
  blockedBy: Id<"UserId">;
  blockedUser: Id<"UserId">;
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

  get blockdBy(): Id<"UserId"> {
    return this.props.blockedBy;
  }

  get blokedUser(): Id<"UserId"> {
    return this.props.blockedUser;
  }
}
