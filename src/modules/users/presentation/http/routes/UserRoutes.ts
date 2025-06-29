import express, { Request, Response } from "express";
import { UserControllers } from "../controllers/UserControllers";

const userRoutes = express.Router();

userRoutes.post("/users", (req: Request, res: Response) =>
  UserControllers.createUser(req, res),
);

export { userRoutes };
