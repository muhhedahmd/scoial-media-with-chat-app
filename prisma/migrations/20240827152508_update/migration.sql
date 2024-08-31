/*
  Warnings:

  - You are about to drop the column `userId` on the `reactionsComment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[comment_id,author_id]` on the table `reactionsComment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "reactionsComment" DROP CONSTRAINT "reactionsComment_author_id_fkey";

-- DropForeignKey
ALTER TABLE "reactionsComment" DROP CONSTRAINT "reactionsComment_comment_id_fkey";

-- AlterTable
ALTER TABLE "reactionsComment" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "reactionsComment_comment_id_author_id_key" ON "reactionsComment"("comment_id", "author_id");

-- AddForeignKey
ALTER TABLE "reactionsComment" ADD CONSTRAINT "reactionsComment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactionsComment" ADD CONSTRAINT "reactionsComment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
