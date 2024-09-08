/*
  Warnings:

  - You are about to drop the column `interactionShareId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `interactionShareId` on the `Mention` table. All the data in the column will be lost.
  - You are about to drop the column `interactionShareId` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `interactionShareId` on the `reactionsComment` table. All the data in the column will be lost.
  - You are about to drop the column `interactionShareId` on the `replay` table. All the data in the column will be lost.
  - You are about to drop the column `interactionShareId` on the `replayLikes` table. All the data in the column will be lost.
  - You are about to drop the `InteractionShare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "InteractionShare" DROP CONSTRAINT "InteractionShare_author_id_fkey";

-- DropForeignKey
ALTER TABLE "InteractionShare" DROP CONSTRAINT "InteractionShare_shareId_fkey";

-- DropForeignKey
ALTER TABLE "Mention" DROP CONSTRAINT "Mention_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "reactionsComment" DROP CONSTRAINT "reactionsComment_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "replay" DROP CONSTRAINT "replay_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "replayLikes" DROP CONSTRAINT "replayLikes_interactionShareId_fkey";

-- DropIndex
DROP INDEX "reactionsComment_comment_id_interactionShareId_key";

-- DropIndex
DROP INDEX "replayLikes_replay_id_interactionShareId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "interactionShareId";

-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "shareId" INTEGER;

-- AlterTable
ALTER TABLE "Mention" DROP COLUMN "interactionShareId";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "interactionShareId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "reactionsComment" DROP COLUMN "interactionShareId";

-- AlterTable
ALTER TABLE "replay" DROP COLUMN "interactionShareId";

-- AlterTable
ALTER TABLE "replayLikes" DROP COLUMN "interactionShareId";

-- DropTable
DROP TABLE "InteractionShare";

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;
