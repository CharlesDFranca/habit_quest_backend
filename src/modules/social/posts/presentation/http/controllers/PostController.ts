import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePostUseCase } from "../../../app/use-cases/CreatePostUseCase";
import { ImageInput } from "@/shared/app/interfaces/IImageStorageService";
import { UseCaseExecutor } from "@/shared/app/UseCaseExecutor";
import { FindPostsByAuthorIdUseCase } from "../../../app/use-cases/FindPostsByAuthorIdUseCase";
import { FindPostByIdUseCase } from "../../../app/use-cases/FindPostByIdUseCase";
import { FindLikedPostsByUserIdUseCase } from "../../../app/use-cases/FindLikedPostsByUserIdUseCase";

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

  static async findPostsByAuthorId(req: Request, res: Response) {
    const { authorId } = req.params;

    const findPostsByAuthorId = container.resolve(FindPostsByAuthorIdUseCase);

    try {
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

      res.status(200).json({
        authorId,
        postsCount: formatedPosts.length,
        posts: formatedPosts,
      });
    } catch (err) {
      if (err instanceof Error) {
        res
          .status(400)
          .json({ message: "something went wrong", err: err.message });
      }
    }
  }

  static async findPostById(req: Request, res: Response) {
    const { postId } = req.body;

    try {
      const findPostByIdUseCase = container.resolve(FindPostByIdUseCase);

      const post = await UseCaseExecutor.run(findPostByIdUseCase, { postId });

      res.status(200).json({ post });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({
          message: "Something went wrong",
          specificError: err.message,
        });
      }
    }
  }

  static async findLikedPostsByUserId(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const findLikedPostsByUserIdUseCase = container.resolve(
        FindLikedPostsByUserIdUseCase,
      );

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

      res.status(200).json({ postsData: formatedPosts });
    } catch (err) {
      if (err instanceof Error) {
        res
          .status(400)
          .json({
            message: "Something went wrong",
            specificError: err.message,
          });
      }
    }
  }
}
