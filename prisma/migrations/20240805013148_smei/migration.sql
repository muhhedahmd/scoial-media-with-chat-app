/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `category_post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "category_post_post_id_key" ON "category_post"("post_id");
