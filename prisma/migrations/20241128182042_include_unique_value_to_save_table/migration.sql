/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `saves` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "saves_userId_postId_key" ON "saves"("userId", "postId");
