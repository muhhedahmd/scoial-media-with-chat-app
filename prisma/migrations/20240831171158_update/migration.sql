-- DropIndex
DROP INDEX "Notification_PostReactionId_key";

-- DropIndex
DROP INDEX "Notification_commentId_key";

-- DropIndex
DROP INDEX "Notification_commentReactionId_key";

-- DropIndex
DROP INDEX "Notification_postId_key";

-- DropIndex
DROP INDEX "Notification_replayId_key";

-- DropIndex
DROP INDEX "Notification_shareId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
