/*
  Warnings:

  - A unique constraint covering the columns `[VideoChatParticipantId]` on the table `Signaling` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Signaling" DROP CONSTRAINT "Signaling_receiverId_fkey";

-- AlterTable
ALTER TABLE "Signaling" ADD COLUMN     "VideoChatParticipantId" INTEGER,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VideoChatParticipant" ADD COLUMN     "signalingId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Signaling_VideoChatParticipantId_key" ON "Signaling"("VideoChatParticipantId");

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_VideoChatParticipantId_fkey" FOREIGN KEY ("VideoChatParticipantId") REFERENCES "VideoChatParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
