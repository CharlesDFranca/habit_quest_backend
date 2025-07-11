import { Request, Response } from "express";
import { container } from "tsyringe";
import { LikeAPostUseCase } from "../../../app/use-cases/post-like/LikeAPostUseCase";
import { UseCaseExecutor } from "@/shared/app/UseCaseExecutor";
import { ValidateRequiredFields } from "@/shared/utils/ValidateRequiredFields";
import { ResponseFormatter } from "@/shared/presentation/http/ResponseFormatter";
import { ApiResponse } from "@/shared/presentation/http/types/ApiReponse";
import { PostLikeIdDto } from "../../../app/dtos/PostLikeIdDto";

export class PostLikeControllers {
  static async createLikePost(req: Request, res: Response) {
    ValidateRequiredFields.use(req.body, ["userId", "postId"]);

    const { userId, postId } = req.body;
    const likeAPostUseCase = container.resolve(LikeAPostUseCase);

    const postLikeId = await UseCaseExecutor.run(likeAPostUseCase, {
      userId,
      postId,
    });

    const response: ApiResponse<PostLikeIdDto> =
      ResponseFormatter.success<PostLikeIdDto>(postLikeId, { postId, userId });

    res.status(201).json(response);
  }
}
