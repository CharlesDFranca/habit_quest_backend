import express, { Request, Response } from "express";
import { PostController } from "../controllers/PostController";

const postRoutes = express.Router();

postRoutes.post("/post", (req: Request, res: Response) =>
  PostController.createPost(req, res),
);

export { postRoutes };
