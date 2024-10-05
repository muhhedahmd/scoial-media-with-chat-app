/*
  Warnings:

  - You are about to drop the column `saveId` on the `Interaction` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `Save` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[InteractionId]` on the table `Save` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `InteractionId` to the `Save` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_saveId_fkey";

-- DropForeignKey
ALTER TABLE "Save" DROP CONSTRAINT "Save_post_id_fkey";

-- DropIndex
DROP INDEX "Save_post_id_idx";

-- DropIndex
DROP INDEX "Save_post_id_key";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "saveId";

-- AlterTable
ALTER TABLE "Save" DROP COLUMN "post_id",
ADD COLUMN     "InteractionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "Save_InteractionId_key" ON "Save"("InteractionId");

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_InteractionId_fkey" FOREIGN KEY ("InteractionId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
