/*
  Warnings:

  - A unique constraint covering the columns `[author_id,name]` on the table `Save_catagory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author_id` to the `Save_catagory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Save_catagory_name_key";

-- AlterTable
ALTER TABLE "Save_catagory" ADD COLUMN     "author_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "Save_catagory_author_id_name_key" ON "Save_catagory"("author_id", "name");

-- AddForeignKey
ALTER TABLE "Save_catagory" ADD CONSTRAINT "Save_catagory_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
