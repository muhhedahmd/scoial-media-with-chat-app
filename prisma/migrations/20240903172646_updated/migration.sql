/*
  Warnings:

  - A unique constraint covering the columns `[comment_id,emoji,innteractId]` on the table `reactionsComment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[comment_id,emoji,interactionShareId]` on the table `reactionsComment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "reactionsComment_comment_id_emoji_innteractId_key" ON "reactionsComment"("comment_id", "emoji", "innteractId");

-- CreateIndex
CREATE UNIQUE INDEX "reactionsComment_comment_id_emoji_interactionShareId_key" ON "reactionsComment"("comment_id", "emoji", "interactionShareId");
