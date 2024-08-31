/*
  Warnings:

  - Added the required column `reactionsCommentId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "reactionsCommentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "reactionsComment" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "emoji" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "reactionsComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reactionsCommentId_fkey" FOREIGN KEY ("reactionsCommentId") REFERENCES "reactionsComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
