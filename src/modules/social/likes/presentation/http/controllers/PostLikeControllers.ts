import { Request, Response } from "express";
import { container } from "tsyringe";
import { LikeAPostUseCase } from "../../../app/use-cases/post-like/LikeAPostUseCase";
import { UseCaseExecutor } from "@/shared/app/UseCaseExecutor";
import { ValidateRequiredFields } from "@/shared/utils/ValidateRequiredFields";

export class PostLikeControllers {
  static async createLikePost(req: Request, res: Response) {
    try {
      ValidateRequiredFields.use(req.body, ["userId", "postId"]);

      const { userId, postId } = req.body;
      const likeAPostUseCase = container.resolve(LikeAPostUseCase);

      const { postLikeId } = await UseCaseExecutor.run(likeAPostUseCase, {
        userId,
        postId,
      });

      res.status(201).json({ postLikeId: postLikeId.value });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({
          message: "Something went wrong",
          specificError: err.message,
        });
      }

      res.status(500).json({
        message: "Something went wrong",
        specificError: err,
      });
    }
  }
}
