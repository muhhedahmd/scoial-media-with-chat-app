-- DropIndex
DROP INDEX "post_parentId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
