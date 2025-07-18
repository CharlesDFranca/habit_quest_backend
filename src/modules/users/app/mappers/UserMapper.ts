import { User } from "../../domain/entities/User";
import { UserDetailsDto } from "../dtos/UserDetailsDto";
import { UserIdDto } from "../dtos/UserIdDto";

export class UserMapper {
  private constructor() {}

  static toDetails(user: User): UserDetailsDto {
    return {
      userId: user.id.value,
      name: user.name.value,
      alias: user.alias.value,
      email: user.email.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toId(user: User): UserIdDto {
    return {
      userId: user.id.value,
    };
  }
}
