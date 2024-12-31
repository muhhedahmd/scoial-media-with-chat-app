/*
  Warnings:

  - You are about to drop the column `VideoChatParticipantId` on the `Signaling` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiverParticipantId]` on the table `Signaling` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `VideoChatParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Signaling" DROP CONSTRAINT "Signaling_VideoChatParticipantId_fkey";

-- AlterTable
ALTER TABLE "Signaling" DROP COLUMN "VideoChatParticipantId",
ADD COLUMN     "receiverParticipantId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Signaling_receiverParticipantId_key" ON "Signaling"("receiverParticipantId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoChatParticipant_userId_key" ON "VideoChatParticipant"("userId");

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_receiverParticipantId_fkey" FOREIGN KEY ("receiverParticipantId") REFERENCES "VideoChatParticipant"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
