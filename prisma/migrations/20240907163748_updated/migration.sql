/*
  Warnings:

  - A unique constraint covering the columns `[parentId]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "parentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "post_parentId_key" ON "post"("parentId");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
