import express, { Request, Response } from "express";
import { UserControllers } from "../controllers/UserControllers";

const userRoutes = express.Router();

userRoutes.post("/users", (req: Request, res: Response) =>
  UserControllers.createUser(req, res),
);

userRoutes.post("/userLogin", (req: Request, res: Response) =>
  UserControllers.userLogin(req, res),
);

userRoutes.get("/users/findAlias", (req: Request, res: Response) =>
  UserControllers.findUserByAlias(req, res),
);

userRoutes.get("/users/findId/:id", (req: Request, res: Response) =>
  UserControllers.findUserById(req, res),
);

export { userRoutes };
