/*
  Warnings:

  - A unique constraint covering the columns `[author_id,postId,type]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Interaction_author_id_postId_key";

-- DropIndex
DROP INDEX "reactionsComment_comment_id_innteractId_key";

-- DropIndex
DROP INDEX "reactionsComment_comment_id_interactionShareId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_author_id_postId_type_key" ON "Interaction"("author_id", "postId", "type");
