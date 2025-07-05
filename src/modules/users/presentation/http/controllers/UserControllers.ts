import { CreateUserUseCase } from "@/modules/users/app/use-cases/CreateUserUseCase";
import { UserIdDto } from "@/modules/users/app/dtos/UserIdDTO";
import { FindUserByAliasUseCase } from "@/modules/users/app/use-cases/FindUserByAliasUseCase";
import { FindUserByIdUseCase } from "@/modules/users/app/use-cases/FindUserByIdUseCase";
import { UseCaseExecutor } from "@/shared/app/UseCaseExecutor";
import { ResponseFormatter } from "@/shared/presentation/http/ResponseFormatter";
import { ApiResponse } from "@/shared/presentation/http/types/ApiReponse";
import { ValidateRequiredFields } from "@/shared/utils/ValidateRequiredFields";
import { ValidateRequiredParameters } from "@/shared/utils/ValidateRequiredParameters";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { UserDetailsDto } from "@/modules/users/app/dtos/UserDetailsDTO";

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
    const userId = await UseCaseExecutor.run(createUserUseCase, {
      alias,
      email,
      name,
      password,
    });

    const response: ApiResponse<UserIdDto> =
      ResponseFormatter.success<UserIdDto>(userId);

    res.status(201).json(response);
  }

  static async findUserByAlias(req: Request, res: Response) {
    const data = req.body;

    ValidateRequiredFields.use(req.body, ["alias"]);

    const findUserByAliasUseCase = container.resolve(FindUserByAliasUseCase);
    const userData = await UseCaseExecutor.run(findUserByAliasUseCase, {
      alias: data.alias,
    });

    const response: ApiResponse<UserDetailsDto> =
      ResponseFormatter.success<UserDetailsDto>(userData);

    res.status(200).json(response);
  }

  static async findUserById(req: Request, res: Response) {
    ValidateRequiredParameters.use(req.params, ["id"]);

    const { id } = req.params;
    const findUserByIdUseCase = container.resolve(FindUserByIdUseCase);
    const userData = await UseCaseExecutor.run(findUserByIdUseCase, {
      userId: id,
    });

    const response: ApiResponse<UserDetailsDto> =
      ResponseFormatter.success<UserDetailsDto>(userData);

    res.status(200).json(response);
  }
}
