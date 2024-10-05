-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'REPLAY_IN_REPLAY';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "mentionid" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_mentionid_fkey" FOREIGN KEY ("mentionid") REFERENCES "Mention"("id") ON DELETE CASCADE ON UPDATE CASCADE;
