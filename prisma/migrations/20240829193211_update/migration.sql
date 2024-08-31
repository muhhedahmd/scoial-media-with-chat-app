/*
  Warnings:

  - Added the required column `imageUrl` to the `reactionsComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reactionsComment" ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "names" JSONB NOT NULL DEFAULT '[]';
