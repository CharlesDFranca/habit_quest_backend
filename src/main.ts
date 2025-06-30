import "reflect-metadata";
import "@/shared/infra/di/container";

import express from "express";
import { envConfig } from "./config/env/EnvConfig";
import { userRoutes } from "./modules/users/presentation/http/routes/UserRoutes";

const PORT = envConfig.getPort() ?? 3000;

const app = express();

app.use(express.json());

app.use(userRoutes);

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
