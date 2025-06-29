import { CreateUserUseCase } from "@/modules/users/app/use-cases/CreateUserUseCase";
import { FindUserByAliasUseCase } from "@/modules/users/app/use-cases/FindUserByAliasUseCase";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class UserControllers {
  static async createUser(req: Request, res: Response) {
    const { email, alias, name, password } = req.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    try {
      if (!email || !alias || !name || !password) {
        const missingFields = [];
        if (!email) missingFields.push("email");
        if (!alias) missingFields.push("alias");
        if (!name) missingFields.push("name");
        if (!password) missingFields.push("password");

        throw new Error(
          `Missing required fields: [${missingFields.join(", ")}]`,
        );
      }

      const createdUser = await createUserUseCase.execute({
        alias,
        email,
        name,
        password,
      });

      res.status(201).json({ userId: createdUser.userId.value });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({
          message: "Error when trying to create a new user",
          errorMessage: err.message,
        });
        return;
      }

      res.status(400).json({
        message: "Error when trying to create a new user",
        errorMessage: err,
      });
    }
  }

  static async findUserByAlias(req: Request, res: Response) {
    const data = req.body;

    const findUserByAliasUseCase = container.resolve(FindUserByAliasUseCase);

    try {
      const user = await findUserByAliasUseCase.execute({ alias: data.alias });
      res.status(200).json({
        userData: {
          id: user.id.value,
          name: user.name.value,
          email: user.email.value,
          passwordHash: user.password.value,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(404).json({ message: err.message, alias: data.alias });
        return;
      }

      res
        .status(404)
        .json({ message: "User not found by alias", alias: data.alias });
      return;
    }
  }
}
