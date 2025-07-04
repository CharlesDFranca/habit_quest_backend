import { MissingRequiredFieldsException } from "../app/errors/MissingRequiredFieldsException";

export class ValidateRequiredFields {
  private constructor() {}

  static use(obj: Record<string, unknown>, requiredFields: string[]) {
    const missing = requiredFields.filter((field) => {
      const val = obj[field];
      return (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "")
      );
    });

    if (missing.length > 0) {
      throw new MissingRequiredFieldsException(missing);
    }
  }
}
