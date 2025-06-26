import { Alias } from "@/shared/domain/value-objects/Alias";
import { Id } from "@/shared/domain/value-objects/Id";

export interface IEnsureAliasIsUniqueService {
  assertAliasIsUnique(alias: Alias, userId: Id<"UserId">): Promise<void>;
}
