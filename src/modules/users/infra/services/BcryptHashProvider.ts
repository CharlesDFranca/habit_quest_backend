import { envConfig } from "@/config/EnvConfig";
import { IHashProvider } from "../../app/interfaces/IHashProvider";
import bcrypt from "bcrypt";
import { injectable } from "tsyringe";

@injectable()
export class BcryptHashProvider implements IHashProvider {
  async hash(password: string): Promise<string> {
    const saltRounds: number = envConfig.getSaltRounds() || 10;

    return bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
