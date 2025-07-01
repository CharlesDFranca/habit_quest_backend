import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePostUseCase } from "../../../app/use-cases/CreatePostUseCase";
import { ImageInput } from "@/shared/app/interfaces/IImageStorageService";
import { UseCaseExecutor } from "@/shared/app/UseCaseExecutor";

export class PostController {
  static async createPost(req: Request, res: Response) {
    const { authorId, content, isPrivate } = req.body;

    const files = req.files as Express.Multer.File[];

    try {
      if (!authorId || !content || !files) {
        const missingFields = [];
        if (!authorId) missingFields.push("authorId");
        if (!content) missingFields.push("content");
        if (!files) missingFields.push("imagesUrls");

        throw new Error(
          `Missing required fields: [${missingFields.join(", ")}]`,
        );
      }

      const createPostUseCase = container.resolve(CreatePostUseCase);

      const imagesUrls: ImageInput[] = files.map((file) => {
        return {
          buffer: file.buffer,
          originalName: file.originalname,
          mimeType: file.mimetype,
        };
      });

      const createdPost = await UseCaseExecutor.run(createPostUseCase, {
        authorId: authorId,
        content: content,
        imagesUrls,
        isPrivate: isPrivate === "true",
      });

      res.status(201).json({ postId: createdPost.postId.value });
    } catch (err) {
      console.log(err);

      if (err instanceof Error) {
        res.status(400).json({
          message: "Error when trying to create a new post",
          errorMessage: err.message,
        });
        return;
      }
    }
  }
}
