/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `comment_like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commentId]` on the table `comment_like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `post_like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `post_like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comment_like_userId_key" ON "comment_like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_like_commentId_key" ON "comment_like"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "post_like_userId_key" ON "post_like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_like_postId_key" ON "post_like"("postId");
