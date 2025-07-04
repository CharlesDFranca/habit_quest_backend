import express, { Request, Response } from "express";
import multer from "multer";
import { uploadConfig } from "@/config/UploadConfig";
import { PostControllers } from "../controllers/PostControllers";

const postRoutes = express.Router();

const upload = multer(uploadConfig.multer);

postRoutes.post(
  "/posts",
  upload.array("image"),
  (req: Request, res: Response) => PostControllers.createPost(req, res),
);

postRoutes.get("/posts/authorId/:authorId", (req: Request, res: Response) =>
  PostControllers.findPostsByAuthorId(req, res),
);

postRoutes.get("/posts/findId/", (req: Request, res: Response) =>
  PostControllers.findPostById(req, res),
);

postRoutes.get("/posts/likedPosts/:userId", (req: Request, res: Response) =>
  PostControllers.findLikedPostsByUserId(req, res),
);

export { postRoutes };
