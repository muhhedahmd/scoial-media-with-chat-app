/*
  Warnings:

  - Added the required column `lastReadMessageId` to the `GroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupMember" ADD COLUMN     "lastReadMessageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_lastReadMessageId_fkey" FOREIGN KEY ("lastReadMessageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
