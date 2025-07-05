import { CreateUserUseCase } from "@/modules/users/app/use-cases/CreateUserUseCase";
import { FindUserByAliasUseCase } from "@/modules/users/app/use-cases/FindUserByAliasUseCase";
import { FindUserByIdUseCase } from "@/modules/users/app/use-cases/FindUserByIdUseCase";
import { UseCaseExecutor } from "@/shared/app/UseCaseExecutor";
import { ResponseFormatter } from "@/shared/presentation/http/ResponseFormatter";
import { ValidateRequiredFields } from "@/shared/utils/ValidateRequiredFields";
import { ValidateRequiredParameters } from "@/shared/utils/ValidateRequiredParameters";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class UserControllers {
  static async createUser(req: Request, res: Response) {
    ValidateRequiredFields.use(req.body, [
      "email",
      "name",
      "alias",
      "password",
    ]);

    const { email, alias, name, password } = req.body;
    const createUserUseCase = container.resolve(CreateUserUseCase);
    const createdUser = await UseCaseExecutor.run(createUserUseCase, {
      alias,
      email,
      name,
      password,
    });

    const response = ResponseFormatter.success({
      userId: createdUser.userId.value,
    });

    res.status(201).json(response);
  }

  static async findUserByAlias(req: Request, res: Response) {
    const data = req.body;

    ValidateRequiredFields.use(req.body, ["alias"]);

    const findUserByAliasUseCase = container.resolve(FindUserByAliasUseCase);
    const userData = await UseCaseExecutor.run(findUserByAliasUseCase, {
      alias: data.alias,
    });

    const response = ResponseFormatter.success(userData);

    res.status(200).json(response);
  }

  static async findUserById(req: Request, res: Response) {
    ValidateRequiredParameters.use(req.params, ["id"]);

    const { id } = req.params;
    const findUserByIdUseCase = container.resolve(FindUserByIdUseCase);
    const userData = await UseCaseExecutor.run(findUserByIdUseCase, {
      userId: id,
    });

    const response = ResponseFormatter.success(userData);

    res.status(200).json(response);
  }
}
