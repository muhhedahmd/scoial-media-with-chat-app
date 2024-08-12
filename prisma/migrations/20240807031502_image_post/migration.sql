/*
  Warnings:

  - You are about to drop the column `image` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "post_image" (
    "id" SERIAL NOT NULL,
    "img_path" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "post_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_image_post_id_key" ON "post_image"("post_id");

-- AddForeignKey
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
