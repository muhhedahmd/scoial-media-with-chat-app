/*
  Warnings:

  - You are about to drop the column `author_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `post_id` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `Interaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_post_id_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "author_id",
DROP COLUMN "post_id";

-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
