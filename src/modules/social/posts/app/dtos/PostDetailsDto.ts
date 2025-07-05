export type PostDetailsDto = {
  postId: string;
  authorId: string;
  content: string;
  commentCount: number;
  likeCount: number;
  images: string[];
  isPinned: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};
