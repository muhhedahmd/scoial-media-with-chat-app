/*
  Warnings:

  - The values [COMMENTREACT,REPLAYREACT] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('MENTION', 'LIKE', 'COMMENT', 'COMMENT_REACT', 'POST_REACT', 'REPLAY_REACT', 'REPLAY', 'FOLLOW', 'FOLLOW_BACK', 'UNFOLLOW', 'BLOCK', 'SHARE', 'SYSTEM', 'MENTION_POST', 'MENTION_COMMENT', 'MENTION_REPLAY', 'REPLAY_IN_REPLAY');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
