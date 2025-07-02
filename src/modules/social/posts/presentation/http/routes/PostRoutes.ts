import express, { Request, Response } from "express";
import { PostController } from "../controllers/PostController";
import multer from "multer";
import { uploadConfig } from "@/config/UploadConfig";

const postRoutes = express.Router();

const upload = multer(uploadConfig.multer);

postRoutes.post(
  "/posts",
  upload.array("image"),
  (req: Request, res: Response) => PostController.createPost(req, res),
);

postRoutes.get("/posts/authorId/:authorId", (req: Request, res: Response) =>
  PostController.findPostsByAuthorId(req, res),
);

postRoutes.get("/posts/findId/", (req: Request, res: Response) =>
  PostController.findPostById(req, res),
);

export { postRoutes };
