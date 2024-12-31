/*
  Warnings:

  - You are about to drop the column `VideoChatParticipantId` on the `Signaling` table. All the data in the column will be lost.
  - You are about to drop the column `signalingId` on the `VideoChatParticipant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `VideoChatParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Signaling" DROP CONSTRAINT "Signaling_VideoChatParticipantId_fkey";

-- AlterTable
ALTER TABLE "Signaling" DROP COLUMN "VideoChatParticipantId",
ADD COLUMN     "VideoChatParticipantUserId" INTEGER;

-- AlterTable
ALTER TABLE "VideoChatParticipant" DROP COLUMN "signalingId";

-- CreateIndex
CREATE UNIQUE INDEX "VideoChatParticipant_userId_key" ON "VideoChatParticipant"("userId");

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_VideoChatParticipantUserId_fkey" FOREIGN KEY ("VideoChatParticipantUserId") REFERENCES "VideoChatParticipant"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
