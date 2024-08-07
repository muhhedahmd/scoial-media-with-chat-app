/*
  Warnings:

  - A unique constraint covering the columns `[post_id,category_id]` on the table `category_post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "category_post_post_id_category_id_id_key";

-- AlterTable
ALTER TABLE "category_post" ADD CONSTRAINT "category_post_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "category_post_post_id_category_id_key" ON "category_post"("post_id", "category_id");
