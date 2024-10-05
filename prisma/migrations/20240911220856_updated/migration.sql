/*
  Warnings:

  - The values [MENTION] on the enum `InteractionType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updated_at` to the `Hashtag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InteractionType_new" AS ENUM ('REPLAY', 'REPLAY_LIKE', 'SHARE', 'REACTION', 'COMMENT', 'COMMENTREACT', 'MENTION_POST', 'MENTION_COMMENT', 'MENTION_REPLAY');
ALTER TABLE "Interaction" ALTER COLUMN "type" TYPE "InteractionType_new" USING ("type"::text::"InteractionType_new");
ALTER TYPE "InteractionType" RENAME TO "InteractionType_old";
ALTER TYPE "InteractionType_new" RENAME TO "InteractionType";
DROP TYPE "InteractionType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'FOLLOW_BACK';
ALTER TYPE "NotificationType" ADD VALUE 'UNFOLLOW';
ALTER TYPE "NotificationType" ADD VALUE 'BLOCK';
ALTER TYPE "NotificationType" ADD VALUE 'MENTION_POST';
ALTER TYPE "NotificationType" ADD VALUE 'MENTION_COMMENT';
ALTER TYPE "NotificationType" ADD VALUE 'MENTION_REPLAY';

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notifierId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_notifyingId_fkey";

-- DropForeignKey
ALTER TABLE "replayLikes" DROP CONSTRAINT "replayLikes_innteractId_fkey";

-- AlterTable
ALTER TABLE "Hashtag" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifierId_fkey" FOREIGN KEY ("notifierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifyingId_fkey" FOREIGN KEY ("notifyingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replayLikes" ADD CONSTRAINT "replayLikes_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
