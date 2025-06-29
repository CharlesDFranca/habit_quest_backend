import { Alias } from "@/shared/domain/value-objects/Alias";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Id } from "@/shared/domain/value-objects/Id";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findUserByAlias(alias: Alias): Promise<User | null>;
  findUserByEmail(email: Email): Promise<User | null>;
  findUserById(id: Id<"UserId">): Promise<User | null>;
}
