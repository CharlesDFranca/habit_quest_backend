import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePostUseCase } from "../../../app/use-cases/CreatePostUseCase";
import { ImageInput } from "@/shared/app/interfaces/IImageStorageService";
import { UseCaseExecutor } from "@/shared/app/UseCaseExecutor";
import { FindPostsByAuthorIdUseCase } from "../../../app/use-cases/FindPostsByAuthorIdUseCase";
import { FindPostByIdUseCase } from "../../../app/use-cases/FindPostByIdUseCase";
import { FindLikedPostsByUserIdUseCase } from "../../../app/use-cases/FindLikedPostsByUserIdUseCase";
import { ValidateRequiredFields } from "@/shared/utils/ValidateRequiredFields";
import { ValidateRequiredParameters } from "@/shared/utils/ValidateRequiredParameters";
import { ResponseFormatter } from "@/shared/presentation/http/ResponseFormatter";

export class PostControllers {
  static async createPost(req: Request, res: Response) {
    ValidateRequiredFields.use(req.body, ["authorId", "content", "isPrivate"]);

    const createPostUseCase = container.resolve(CreatePostUseCase);
    const { authorId, content, isPrivate } = req.body;

    const files = req.files as Express.Multer.File[];
    const imagesUrls: ImageInput[] = files.map((file) => {
      return {
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
      };
    });

    const postId = await UseCaseExecutor.run(createPostUseCase, {
      authorId: authorId,
      content: content,
      imagesUrls,
      isPrivate: isPrivate === "true",
    });

    const response = ResponseFormatter.success(postId);

    res.status(201).json(response);
  }

  static async findPostsByAuthorId(req: Request, res: Response) {
    ValidateRequiredParameters.use(req.params, ["authorId"]);

    const { authorId } = req.params;
    const findPostsByAuthorId = container.resolve(FindPostsByAuthorIdUseCase);
    const posts = await UseCaseExecutor.run(findPostsByAuthorId, {
      authorId,
    });

    const response = ResponseFormatter.success(posts, {
      postsCount: posts.length,
    });

    res.status(200).json(response);
  }

  static async findPostById(req: Request, res: Response) {
    ValidateRequiredFields.use(req.body, ["postId"]);

    const findPostByIdUseCase = container.resolve(FindPostByIdUseCase);

    const { postId } = req.body;
    const post = await UseCaseExecutor.run(findPostByIdUseCase, { postId });

    const response = ResponseFormatter.success(post);

    res.status(200).json(response);
  }

  static async findLikedPostsByUserId(req: Request, res: Response) {
    ValidateRequiredParameters.use(req.params, ["userId"]);

    const findLikedPostsByUserIdUseCase = container.resolve(
      FindLikedPostsByUserIdUseCase,
    );

    const { userId } = req.params;
    const posts = await UseCaseExecutor.run(findLikedPostsByUserIdUseCase, {
      userId,
    });
    const response = ResponseFormatter.success(posts, {
      likedPostsCount: posts.length,
    });

    res.status(200).json(response);
  }
}
