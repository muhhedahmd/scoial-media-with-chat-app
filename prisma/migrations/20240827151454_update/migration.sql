/*
  Warnings:

  - You are about to drop the column `reactionsCommentId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `reactionsComment` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `reactionsComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reactionsComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "reactionsCommentId";

-- AlterTable
ALTER TABLE "reactionsComment" DROP COLUMN "count",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "reactionsComment" ADD CONSTRAINT "reactionsComment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
