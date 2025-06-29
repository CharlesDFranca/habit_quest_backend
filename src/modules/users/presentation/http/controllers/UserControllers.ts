import { CreateUserUseCase } from "@/modules/users/app/use-cases/CreateUserUseCase";
import { Request, Response } from "express";
import { container } from "tsyringe";

export class UserControllers {
  static async createUser(req: Request, res: Response) {
    const data = req.body;

    const craeteUserUseCase = container.resolve(CreateUserUseCase);

    const createdUser = await craeteUserUseCase.execute({
      alias: data.alias,
      email: data.email,
      name: data.name,
      password: data.password,
    });

    res.status(201).json({ userId: createdUser.userId.value });
  }
}
