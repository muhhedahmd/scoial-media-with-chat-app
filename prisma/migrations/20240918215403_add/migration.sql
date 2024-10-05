/*
  Warnings:

  - You are about to drop the column `pinId` on the `Interaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_pinId_fkey";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "pinId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "pin" ADD COLUMN     "InteractionId" INTEGER;

-- AddForeignKey
ALTER TABLE "pin" ADD CONSTRAINT "pin_InteractionId_fkey" FOREIGN KEY ("InteractionId") REFERENCES "Interaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
