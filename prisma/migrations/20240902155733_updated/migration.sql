-- DropForeignKey
ALTER TABLE "Mention" DROP CONSTRAINT "Mention_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Mention" DROP CONSTRAINT "Mention_postId_fkey";

-- DropForeignKey
ALTER TABLE "Mention" DROP CONSTRAINT "Mention_replayId_fkey";

-- DropForeignKey
ALTER TABLE "Mention" DROP CONSTRAINT "Mention_shareId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "innteractId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Mention" ADD COLUMN     "interactionShareId" INTEGER,
ADD COLUMN     "interactioneId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "replay" ALTER COLUMN "innteractId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_CommentToMention" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MentionTopost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MentionToreplay" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CommentToMention_AB_unique" ON "_CommentToMention"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentToMention_B_index" ON "_CommentToMention"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MentionTopost_AB_unique" ON "_MentionTopost"("A", "B");

-- CreateIndex
CREATE INDEX "_MentionTopost_B_index" ON "_MentionTopost"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MentionToreplay_AB_unique" ON "_MentionToreplay"("A", "B");

-- CreateIndex
CREATE INDEX "_MentionToreplay_B_index" ON "_MentionToreplay"("B");

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_interactionShareId_fkey" FOREIGN KEY ("interactionShareId") REFERENCES "InteractionShare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_interactioneId_fkey" FOREIGN KEY ("interactioneId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentToMention" ADD CONSTRAINT "_CommentToMention_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentToMention" ADD CONSTRAINT "_CommentToMention_B_fkey" FOREIGN KEY ("B") REFERENCES "Mention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentionTopost" ADD CONSTRAINT "_MentionTopost_A_fkey" FOREIGN KEY ("A") REFERENCES "Mention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentionTopost" ADD CONSTRAINT "_MentionTopost_B_fkey" FOREIGN KEY ("B") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentionToreplay" ADD CONSTRAINT "_MentionToreplay_A_fkey" FOREIGN KEY ("A") REFERENCES "Mention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MentionToreplay" ADD CONSTRAINT "_MentionToreplay_B_fkey" FOREIGN KEY ("B") REFERENCES "replay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
