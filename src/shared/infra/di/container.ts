import { IPostRepository } from "@/modules/social/posts/domain/repositories/IPostRepository";
import { PrismaPostRepository } from "@/modules/social/posts/infra/repositories/PrismaPostsRepository";
import { IHashProvider } from "@/modules/users/app/interfaces/IHashProvider";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { EnsureAliasIsUniqueService } from "@/modules/users/domain/services/EnsureAliasIsUniqueService";
import { EnsureEmailIsUniqueService } from "@/modules/users/domain/services/EnsureEmailIsUniqueService";
import { IEnsureAliasIsUniqueService } from "@/modules/users/domain/services/interfaces/IEnsureAliasIsUniqueService";
import { IEnsureEmailIsUniqueService } from "@/modules/users/domain/services/interfaces/IEnsureEmailIsUniqueService";
import { PrismaUserRepository } from "@/modules/users/infra/repositories/PrismaUserRepository";
import { BcryptHashProvider } from "@/modules/users/infra/services/BcryptHashProvider";
import { container } from "tsyringe";

// -----------------------------------------------------------------------------------------------
// USER
// -----------------------------------------------------------------------------------------------

container.register<IUserRepository>("UserRepository", PrismaUserRepository);
container.register<IHashProvider>("HashProvider", BcryptHashProvider);

container.register<IEnsureAliasIsUniqueService>("EnsureAliasIsUniqueService", {
  useFactory(dependencyContainer) {
    return new EnsureAliasIsUniqueService(
      dependencyContainer.resolve("UserRepository"),
    );
  },
});

container.register<IEnsureEmailIsUniqueService>("EnsureEmailIsUniqueService", {
  useFactory(dependencyContainer) {
    return new EnsureEmailIsUniqueService(
      dependencyContainer.resolve("UserRepository"),
    );
  },
});

// -----------------------------------------------------------------------------------------------
// POST
// -----------------------------------------------------------------------------------------------

container.register<IPostRepository>("PostRepository", PrismaPostRepository);
