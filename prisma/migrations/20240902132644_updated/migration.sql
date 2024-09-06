/*
  Warnings:

  - You are about to drop the column `commentId` on the `Interaction` table. All the data in the column will be lost.
  - You are about to drop the column `commentReactionId` on the `Interaction` table. All the data in the column will be lost.
  - You are about to drop the column `reactionId` on the `Interaction` table. All the data in the column will be lost.
  - You are about to drop the column `replayId` on the `Interaction` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `reactionsComment` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `replay` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `replayLikes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[author_id,shareId]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `innteractId` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Share` table without a default value. This is not possible if the table is not empty.
  - Added the required column `innteractId` to the `reactionsComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `innteractId` to the `replay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `innteractId` to the `replayLikes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_commentReactionId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_reactionId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_replayId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_shareId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_post_id_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_post_id_fkey";

-- DropForeignKey
ALTER TABLE "reactionsComment" DROP CONSTRAINT "reactionsComment_author_id_fkey";

-- DropForeignKey
ALTER TABLE "replay" DROP CONSTRAINT "replay_author_id_fkey";

-- DropForeignKey
ALTER TABLE "replayLikes" DROP CONSTRAINT "replayLikes_user_id_fkey";

-- DropIndex
DROP INDEX "Reaction_post_id_user_id_key";

-- DropIndex
DROP INDEX "reactionsComment_comment_id_author_id_key";

-- DropIndex
DROP INDEX "replayLikes_replay_id_user_id_key";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "commentId",
DROP COLUMN "commentReactionId",
DROP COLUMN "reactionId",
DROP COLUMN "replayId";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "post_id",
DROP COLUMN "user_id",
ADD COLUMN     "innteractId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "author_id",
DROP COLUMN "created_at",
DROP COLUMN "post_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "reactionsComment" DROP COLUMN "author_id",
ADD COLUMN     "innteractId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "replay" DROP COLUMN "author_id",
ADD COLUMN     "innteractId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "replayLikes" DROP COLUMN "user_id",
ADD COLUMN     "innteractId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_author_id_shareId_key" ON "Interaction"("author_id", "shareId");

-- AddForeignKey
ALTER TABLE "reactionsComment" ADD CONSTRAINT "reactionsComment_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replay" ADD CONSTRAINT "replay_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replayLikes" ADD CONSTRAINT "replayLikes_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
