import express from "express";
import { envConfig } from "./config/EnvConfig";

const PORT = envConfig.getPort() ?? 3000;

const app = express();

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
