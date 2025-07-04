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

type FormatedPost = {
  id: string;
  content: string;
  imageUrls: string[];
  commentCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export class PostController {
  static async createPost(req: Request, res: Response) {
    try {
      ValidateRequiredFields.use(req.body, [
        "authorId",
        "content",
        "isPrivate",
      ]);

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

      const createdPost = await UseCaseExecutor.run(createPostUseCase, {
        authorId: authorId,
        content: content,
        imagesUrls,
        isPrivate: isPrivate === "true",
      });

      const response = ResponseFormatter.success({
        postId: createdPost.postId.value,
      });

      res.status(201).json(response);
    } catch (err) {
      if (err instanceof Error) {
        const error = ResponseFormatter.error({
          name: err.name,
          message: err.message,
        });

        res.status(400).json(error);
        return;
      }
    }
  }

  static async findPostsByAuthorId(req: Request, res: Response) {
    try {
      ValidateRequiredParameters.use(req.params, ["authorId"]);

      const { authorId } = req.params;
      const findPostsByAuthorId = container.resolve(FindPostsByAuthorIdUseCase);
      const posts = await UseCaseExecutor.run(findPostsByAuthorId, {
        authorId,
      });

      const formatedPosts: FormatedPost[] = posts.map((post) => {
        return {
          id: post.id.value,
          content: post.content.value,
          imageUrls: post.images.map((image) => image.value),
          commentCount: post.commentCount.value,
          likeCount: post.likeCount.value,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        } as FormatedPost;
      });

      const response = ResponseFormatter.success(
        { posts: formatedPosts },
        { postsCount: formatedPosts.length },
      );

      res.status(200).json(response);
    } catch (err) {
      if (err instanceof Error) {
        const error = ResponseFormatter.error({
          name: err.name,
          message: err.message,
        });

        res.status(400).json(error);
      }
    }
  }

  static async findPostById(req: Request, res: Response) {
    try {
      ValidateRequiredFields.use(req.body, ["postId"]);

      const findPostByIdUseCase = container.resolve(FindPostByIdUseCase);

      const { postId } = req.body;
      const post = await UseCaseExecutor.run(findPostByIdUseCase, { postId });

      const response = ResponseFormatter.success(post);

      res.status(200).json(response);
    } catch (err) {
      if (err instanceof Error) {
        const error = ResponseFormatter.error({
          name: err.name,
          message: err.message,
        });

        res.status(400).json(error);
      }
    }
  }

  static async findLikedPostsByUserId(req: Request, res: Response) {
    try {
      ValidateRequiredParameters.use(req.params, ["userId"]);

      const findLikedPostsByUserIdUseCase = container.resolve(
        FindLikedPostsByUserIdUseCase,
      );

      const { userId } = req.params;
      const posts = await UseCaseExecutor.run(findLikedPostsByUserIdUseCase, {
        userId,
      });

      const formatedPosts: FormatedPost[] = posts.map((post) => {
        return {
          id: post.id.value,
          content: post.content.value,
          imageUrls: post.images.map((image) => image.value),
          commentCount: post.commentCount.value,
          likeCount: post.likeCount.value,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        } as FormatedPost;
      });

      const response = ResponseFormatter.success(formatedPosts, {
        likedPostsCount: formatedPosts.length,
      });

      res.status(200).json(response);
    } catch (err) {
      if (err instanceof Error) {
        const error = ResponseFormatter.error({
          name: err.name,
          message: err.message,
        });

        res.status(400).json(error);
      }
    }
  }
}
