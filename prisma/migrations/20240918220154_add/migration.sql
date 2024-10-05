/*
  Warnings:

  - You are about to drop the column `post_id` on the `pin` table. All the data in the column will be lost.
  - Made the column `InteractionId` on table `pin` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "pin" DROP CONSTRAINT "pin_InteractionId_fkey";

-- DropForeignKey
ALTER TABLE "pin" DROP CONSTRAINT "pin_post_id_fkey";

-- DropIndex
DROP INDEX "pin_post_id_idx";

-- DropIndex
DROP INDEX "pin_post_id_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "pin" DROP COLUMN "post_id",
ALTER COLUMN "InteractionId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "pin_InteractionId_idx" ON "pin"("InteractionId");

-- AddForeignKey
ALTER TABLE "pin" ADD CONSTRAINT "pin_InteractionId_fkey" FOREIGN KEY ("InteractionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
