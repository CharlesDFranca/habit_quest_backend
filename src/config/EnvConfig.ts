import "dotenv/config";
import { IEnvConfig } from "./interfaces/IEnvConfig";

class EnvConfig implements IEnvConfig {
  getPort(): number {
    return Number(process.env.PORT);
  }
}

const envConfig = new EnvConfig();

export { envConfig };
