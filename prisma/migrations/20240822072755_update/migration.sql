/*
  Warnings:

  - Added the required column `asset_folder` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset_id` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `post_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post_image" ADD COLUMN     "asset_folder" TEXT NOT NULL,
ADD COLUMN     "asset_id" TEXT NOT NULL,
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "height" TEXT NOT NULL,
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "width" TEXT NOT NULL;
