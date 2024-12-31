/*
  Warnings:

  - Added the required column `chatId` to the `VideoChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `VideoChat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoChatStatus" AS ENUM ('PENDING', 'ONGOING', 'ENDED', 'MISSED');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "VideoChat" ADD COLUMN     "chatId" INTEGER NOT NULL,
ADD COLUMN     "status" "VideoChatStatus" NOT NULL;

-- CreateTable
CREATE TABLE "Signaling" (
    "id" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signaling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Signaling_roomId_idx" ON "Signaling"("roomId");

-- AddForeignKey
ALTER TABLE "VideoChat" ADD CONSTRAINT "VideoChat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signaling" ADD CONSTRAINT "Signaling_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
