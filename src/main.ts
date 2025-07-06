import "reflect-metadata";
import "@/shared/infra/di/container";

import express from "express";
import { envConfig } from "./config/env/EnvConfig";
import { userRoutes } from "./modules/users/presentation/http/routes/UserRoutes";
import { postRoutes } from "./modules/social/posts/presentation/http/routes/PostRoutes";
import { postLikeRoutes } from "./modules/social/likes/presentation/http/routes/PostLikeRoutes";
import { ErrorMiddleware } from "./shared/presentation/http/middlewares/ErrorMiddleware";
import { blockedUserRoutes } from "./modules/users/presentation/http/routes/BlockedUserRoutes";

const PORT = envConfig.getPort() ?? 3000;

const app = express();

app.use(express.json());

app.use(userRoutes);
app.use(postRoutes);
app.use(postLikeRoutes);
app.use(blockedUserRoutes);

app.use(ErrorMiddleware.use);

app.listen(PORT, () => {
  console.log(`[CONFIG]: App is running on PORT: ${envConfig.getPort()}`);
  console.log(
    `[CONFIG]: App is using SALT_ROUNDS: ${envConfig.getSaltRounds()}`,
  );
  console.log(
    `[CONFIG]: App is using this STORAGE_DRIVER: ${envConfig.getStorageDriver()}`,
  );
});
