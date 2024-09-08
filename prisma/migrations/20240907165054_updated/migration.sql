-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "title" DROP NOT NULL;
