import express, { Request, Response } from "express";
import { PostController } from "../controllers/PostController";
import multer from "multer";
import { uploadConfig } from "@/config/UploadConfig";

const postRoutes = express.Router();

const upload = multer(uploadConfig.multer);

postRoutes.post("/post", upload.array("image"), (req: Request, res: Response) =>
  PostController.createPost(req, res),
); 

export { postRoutes };
