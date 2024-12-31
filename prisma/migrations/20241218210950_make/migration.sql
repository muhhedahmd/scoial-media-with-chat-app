-- DropForeignKey
ALTER TABLE "VideoChatParticipant" DROP CONSTRAINT "VideoChatParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "VideoChatParticipant" DROP CONSTRAINT "VideoChatParticipant_videoChatId_fkey";

-- DropIndex
DROP INDEX "VideoChatParticipant_userId_key";

-- AlterTable
ALTER TABLE "VideoChatParticipant" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "VideoChatParticipant" ADD CONSTRAINT "VideoChatParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoChatParticipant" ADD CONSTRAINT "VideoChatParticipant_videoChatId_fkey" FOREIGN KEY ("videoChatId") REFERENCES "VideoChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
