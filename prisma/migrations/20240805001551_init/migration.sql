/*
  Warnings:

  - You are about to drop the column `category_id` on the `post` table. All the data in the column will be lost.
  - You are about to drop the `_categoryTopost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_categoryTopost" DROP CONSTRAINT "_categoryTopost_A_fkey";

-- DropForeignKey
ALTER TABLE "_categoryTopost" DROP CONSTRAINT "_categoryTopost_B_fkey";

-- DropIndex
DROP INDEX "post_category_id_key";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "category_id";

-- DropTable
DROP TABLE "_categoryTopost";

-- CreateTable
CREATE TABLE "category_post" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "category_post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_post_post_id_key" ON "category_post"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_post_category_id_key" ON "category_post"("category_id");

-- AddForeignKey
ALTER TABLE "category_post" ADD CONSTRAINT "category_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_post" ADD CONSTRAINT "category_post_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
