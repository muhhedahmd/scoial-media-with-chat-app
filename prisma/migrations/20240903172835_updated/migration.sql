/*
  Warnings:

  - A unique constraint covering the columns `[comment_id,innteractId]` on the table `reactionsComment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[comment_id,interactionShareId]` on the table `reactionsComment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "reactionsComment_comment_id_emoji_innteractId_key";

-- DropIndex
DROP INDEX "reactionsComment_comment_id_emoji_interactionShareId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "reactionsComment_comment_id_innteractId_key" ON "reactionsComment"("comment_id", "innteractId");

-- CreateIndex
CREATE UNIQUE INDEX "reactionsComment_comment_id_interactionShareId_key" ON "reactionsComment"("comment_id", "interactionShareId");
