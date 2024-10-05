-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'REPLY_REACT_AUTHOR';
ALTER TYPE "NotificationType" ADD VALUE 'REPLY_REACT_COMMENTER';
ALTER TYPE "NotificationType" ADD VALUE 'COMMENT_REACT_AUTHOR';
ALTER TYPE "NotificationType" ADD VALUE 'COMMENT_REACT_COMMENTER';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
