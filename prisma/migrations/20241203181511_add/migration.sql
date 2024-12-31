/*
  Warnings:

  - You are about to drop the column `roomId` on the `Message` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Message_roomId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "roomId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
