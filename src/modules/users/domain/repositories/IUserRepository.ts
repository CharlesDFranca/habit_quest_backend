import { Alias } from "@/shared/domain/value-objects/Alias";
import { User } from "../entities/User";

export interface IUserRepository {
  findUserByAlias(alias: Alias): Promise<User | null>;
}
