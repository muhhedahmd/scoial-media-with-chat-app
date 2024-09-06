-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_innteractId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_innteractId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "reactionsComment" DROP CONSTRAINT "reactionsComment_innteractId_fkey";

-- DropForeignKey
ALTER TABLE "reactionsComment" DROP CONSTRAINT "reactionsComment_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "replay" DROP CONSTRAINT "replay_innteractId_fkey";

-- DropForeignKey
ALTER TABLE "replay" DROP CONSTRAINT "replay_interactionShareId_fkey";

-- DropForeignKey
ALTER TABLE "replayLikes" DROP CONSTRAINT "replayLikes_interactionShareId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AddForeignKey
ALTER TABLE "reactionsComment" ADD CONSTRAINT "reactionsComment_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactionsComment" ADD CONSTRAINT "reactionsComment_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replay" ADD CONSTRAINT "replay_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replay" ADD CONSTRAINT "replay_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replayLikes" ADD CONSTRAINT "replayLikes_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE CASCADE ON UPDATE CASCADE;
