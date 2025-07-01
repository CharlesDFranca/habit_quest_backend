import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePostUseCase } from "../../../app/use-cases/CreatePostUseCase";

export class PostController {
  static async createPost(req: Request, res: Response) {
    const { authorId, content, imagesUrls, isPrivate } = req.body;
    try {
      if (!authorId || !content || !imagesUrls) {
        const missingFields = [];
        if (!authorId) missingFields.push("authorId");
        if (!content) missingFields.push("content");
        if (!imagesUrls) missingFields.push("imagesUrls");

        throw new Error(
          `Missing required fields: [${missingFields.join(", ")}]`,
        );
      }

      const createPostUseCase = container.resolve(CreatePostUseCase);

      const postId = await createPostUseCase.execute({
        authorId: authorId,
        content: content,
        imagesUrls: imagesUrls,
        isPrivate: isPrivate,
      });

      res.status(201).json({ postId });
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
