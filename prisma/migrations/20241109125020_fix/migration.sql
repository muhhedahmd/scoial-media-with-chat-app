-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "encryptedContent" SET DATA TYPE TEXT,
ALTER COLUMN "iv" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
