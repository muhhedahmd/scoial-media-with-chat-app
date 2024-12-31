-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;
