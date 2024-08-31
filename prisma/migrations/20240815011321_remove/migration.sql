/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `Follows` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Follows_followerId_key";

-- DropIndex
DROP INDEX "Follows_followingId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Follows_followerId_followingId_key" ON "Follows"("followerId", "followingId");
