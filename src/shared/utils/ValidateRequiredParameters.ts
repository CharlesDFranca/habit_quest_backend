import { MissingRequiredParametersException } from "../app/errors/MissingRequiredParametersException";

export class ValidateRequiredParameters {
  private constructor() {}

  static use(obj: Record<string, unknown>, requiredParameters: string[]) {
    const missing = requiredParameters.filter((parameter) => {
      const val = obj[parameter];
      return (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "")
      );
    });

    if (missing.length > 0) {
      throw new MissingRequiredParametersException(missing);
    }
  }
}
