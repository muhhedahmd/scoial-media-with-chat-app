-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "replay" ADD COLUMN     "parentId" INTEGER;

-- CreateIndex
CREATE INDEX "replay_comment_id_idx" ON "replay"("comment_id");

-- AddForeignKey
ALTER TABLE "replay" ADD CONSTRAINT "replay_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "replay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
