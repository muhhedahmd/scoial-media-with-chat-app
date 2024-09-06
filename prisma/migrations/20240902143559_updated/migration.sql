/*
  Warnings:

  - You are about to drop the column `shareId` on the `Interaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_shareId_fkey";

-- DropIndex
DROP INDEX "Interaction_author_id_shareId_key";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "interactionShareId" INTEGER;

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "shareId";

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "interactionShareId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "reactionsComment" ADD COLUMN     "interactionShareId" INTEGER;

-- AlterTable
ALTER TABLE "replay" ADD COLUMN     "interactionShareId" INTEGER;

-- AlterTable
ALTER TABLE "replayLikes" ADD COLUMN     "interactionShareId" INTEGER;

-- CreateTable
CREATE TABLE "InteractionShare" (
    "id" SERIAL NOT NULL,
    "type" "InteractionType" NOT NULL,
    "author_id" INTEGER NOT NULL,
    "shareId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InteractionShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InteractionShare_author_id_shareId_key" ON "InteractionShare"("author_id", "shareId");

-- AddForeignKey
ALTER TABLE "reactionsComment" ADD CONSTRAINT "reactionsComment_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionShare" ADD CONSTRAINT "InteractionShare_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionShare" ADD CONSTRAINT "InteractionShare_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replay" ADD CONSTRAINT "replay_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replayLikes" ADD CONSTRAINT "replayLikes_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE SET NULL ON UPDATE CASCADE;
