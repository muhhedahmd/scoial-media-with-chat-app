/*
  Warnings:

  - You are about to drop the column `shareId` on the `Interaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[post_id]` on the table `Share` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_shareId_fkey";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "shareId";

-- AlterTable
ALTER TABLE "Share" ALTER COLUMN "post_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "Share_post_id_key" ON "Share"("post_id");
