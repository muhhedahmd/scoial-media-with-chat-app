/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `videoChatId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[creatorId,id]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reciverId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `Signaling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Signaling` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Signaling` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VideoCallStatus" AS ENUM ('AVAILABLE', 'IN_CALL', 'DO_NOT_DISTURB');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('TEXT_GROUP', 'TEXT_DIRECT', 'VIDEO_GROUP', 'VIDEO_DIRECT', 'FAST_VIDEO', 'Audio_GROUP', 'Audio_DIRECT', 'FAST_Audio');

-- CreateEnum
CREATE TYPE "SignalingType" AS ENUM ('OFFER', 'ANSWER', 'ICE_CANDIDATE');

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_videoChatId_fkey";

-- DropForeignKey
ALTER TABLE "Signaling" DROP CONSTRAINT "Signaling_roomId_fkey";

-- DropIndex
DROP INDEX "Chat_creatorId_receiverId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "receiverId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "reciverId" INTEGER NOT NULL,
ADD COLUMN     "roomId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "videoChatId",
ADD COLUMN     "roomId" INTEGER;

-- AlterTable
ALTER TABLE "Signaling" ADD COLUMN     "receiverId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "SignalingType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "videoCallStatus" "VideoCallStatus" NOT NULL DEFAULT 'AVAILABLE',
ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "groupInvitation" ADD COLUMN     "roomId" INTEGER;

-- CreateTable
CREATE TABLE "VideoChatParticipant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "videoChatId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "VideoChatParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoomType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomParticipant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "RoomParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoChatParticipant_userId_key" ON "VideoChatParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoChatParticipant_userId_videoChatId_key" ON "VideoChatParticipant"("userId", "videoChatId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomParticipant_userId_roomId_key" ON "RoomParticipant"("userId", "roomId");

-- CreateIndex
CREATE INDEX "Chat_roomId_idx" ON "Chat"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_creatorId_id_key" ON "Chat"("creatorId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_roomId_key" ON "Message"("roomId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_reciverId_fkey" FOREIGN KEY ("reciverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoChatParticipant" ADD CONSTRAINT "VideoChatParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoChatParticipant" ADD CONSTRAINT "VideoChatParticipant_videoChatId_fkey" FOREIGN KEY ("videoChatId") REFERENCES "VideoChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupInvitation" ADD CONSTRAINT "groupInvitation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
