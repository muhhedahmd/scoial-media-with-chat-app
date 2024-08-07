/*
  Warnings:

  - The primary key for the `category_post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[post_id,category_id,id]` on the table `category_post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "category_post" DROP CONSTRAINT "category_post_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "category_post_post_id_category_id_id_key" ON "category_post"("post_id", "category_id", "id");
