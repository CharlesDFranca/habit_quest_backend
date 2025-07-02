import express, { Request, Response } from "express";
import { PostLikeControllers } from "../controllers/PostLikeControllers";

const postLikeRoutes = express.Router();

postLikeRoutes.post("/postLike", (req: Request, res: Response) =>
  PostLikeControllers.createLikePost(req, res),
);

export { postLikeRoutes };
