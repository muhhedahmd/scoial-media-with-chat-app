-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_lastReadMessageId_fkey";

-- AlterTable
ALTER TABLE "GroupMember" ALTER COLUMN "lastReadMessageId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_lastReadMessageId_fkey" FOREIGN KEY ("lastReadMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
