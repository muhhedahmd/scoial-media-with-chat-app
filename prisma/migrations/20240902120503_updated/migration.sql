/*
  Warnings:

  - A unique constraint covering the columns `[author_id,postId]` on the table `Interaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `innteractId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_commentId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "innteractId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_author_id_postId_key" ON "Interaction"("author_id", "postId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_innteractId_fkey" FOREIGN KEY ("innteractId") REFERENCES "Interaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
