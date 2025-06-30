import "dotenv/config";
import { IEnvConfig } from "./interfaces/IEnvConfig";

class EnvConfig implements IEnvConfig {
  getPort(): number {
    return Number(process.env.PORT);
  }

  getSaltRounds(): number {
    return Number(process.env.SALT_ROUNDS);
  }
}

const envConfig = new EnvConfig();

export { envConfig };
