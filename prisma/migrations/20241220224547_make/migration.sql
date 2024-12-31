/*
  Warnings:

  - You are about to drop the column `VideoChatParticipantUserId` on the `Signaling` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Signaling" DROP CONSTRAINT "Signaling_VideoChatParticipantUserId_fkey";

-- DropIndex
DROP INDEX "VideoChatParticipant_userId_key";

-- AlterTable
ALTER TABLE "Signaling" DROP COLUMN "VideoChatParticipantUserId",
ADD COLUMN     "VideoChatParticipantId" INTEGER;

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_VideoChatParticipantId_fkey" FOREIGN KEY ("VideoChatParticipantId") REFERENCES "VideoChatParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
