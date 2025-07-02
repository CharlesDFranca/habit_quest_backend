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
import { IImageStorageService } from "@/shared/app/interfaces/IImageStorageService";
import { container } from "tsyringe";
import { DiskStorageService } from "../services/DiskStorageService";
import { IImageCompressorService } from "@/shared/app/interfaces/IImageCompressorService";
import { SharpImageCompressor } from "../services/SharpImageCompressor";
import { IPostLikeRepository } from "@/modules/social/likes/domain/repositories/IPostLikeRepository";
import { PrismaPostLikeRepository } from "@/modules/social/likes/infra/repositories/PrismaLikePostRepository";
import { ICommentLikeRepository } from "@/modules/social/likes/domain/repositories/ICommentLikeRepository";
import { PrismaCommentLikeRepository } from "@/modules/social/likes/infra/repositories/PrismaCommentLikeRepository";
import { IEnsureOneCommentLikePerUserService } from "@/modules/social/likes/domain/services/interfaces/IEnsureOneCommentLikePerUserService";
import { EnsureOneCommentLikePerUserService } from "@/modules/social/likes/domain/services/EnsureOneCommentLikePerUserService";
import { IEnsureOnePostLikePerUserService } from "@/modules/social/likes/domain/services/interfaces/IEnsureOnePostLikePerUserService";
import { EnsureOnePostLikePerUserService } from "@/modules/social/likes/domain/services/EnsureOnePostLikePerUserService";

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

container.register<IImageStorageService>(
  "ImageStorageService",
  DiskStorageService,
);
container.register<IImageCompressorService>(
  "ImageCompressorService",
  SharpImageCompressor,
);

// -----------------------------------------------------------------------------------------------
// LIKE
// -----------------------------------------------------------------------------------------------

container.register<IPostLikeRepository>(
  "PostLikeRepository",
  PrismaPostLikeRepository,
);
container.register<ICommentLikeRepository>(
  "CommentLikeRepository",
  PrismaCommentLikeRepository,
);

container.register<IEnsureOneCommentLikePerUserService>(
  "EnsureOneCommentLikePerUserService",
  {
    useFactory(dependencyContainer) {
      return new EnsureOneCommentLikePerUserService(
        dependencyContainer.resolve("CommentLikeRepository"),
      );
    },
  },
);

container.register<IEnsureOnePostLikePerUserService>(
  "EnsureOnePostLikePerUserService",
  {
    useFactory(dependencyContainer) {
      return new EnsureOnePostLikePerUserService(
        dependencyContainer.resolve("PostLikeRepository"),
      );
    },
  },
);
