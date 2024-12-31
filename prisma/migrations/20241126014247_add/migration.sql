-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateTable
CREATE TABLE "MessageLinks" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messageId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "domain" TEXT NOT NULL,

    CONSTRAINT "MessageLinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageLinks" ADD CONSTRAINT "MessageLinks_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
