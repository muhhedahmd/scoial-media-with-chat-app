/*
  Warnings:

  - A unique constraint covering the columns `[comment_id]` on the table `reactionsComment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_reactionsCommentId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "reactionsComment_comment_id_key" ON "reactionsComment"("comment_id");

-- AddForeignKey
ALTER TABLE "reactionsComment" ADD CONSTRAINT "reactionsComment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
