-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "post_image" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
