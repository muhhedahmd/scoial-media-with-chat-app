/*
  Warnings:

  - The `tags` column on the `post_image` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `height` on the `post_image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `width` on the `post_image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "post_image" DROP COLUMN "height",
ADD COLUMN     "height" INTEGER NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]',
DROP COLUMN "width",
ADD COLUMN     "width" INTEGER NOT NULL;
