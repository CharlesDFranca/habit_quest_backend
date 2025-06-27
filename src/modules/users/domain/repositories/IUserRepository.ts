import { Alias } from "@/shared/domain/value-objects/Alias";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findUserByAlias(alias: Alias): Promise<User | null>;
  findUserByEmail(email: Email): Promise<User | null>;
}
