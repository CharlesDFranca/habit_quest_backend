import { IIdGenerator } from "./intefaces/IIdGenerator";
import { randomUUID } from "node:crypto";

export class IdGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
