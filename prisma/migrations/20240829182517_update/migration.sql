/*
  Warnings:

  - Added the required column `emoji` to the `reactionsComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reactionsComment" ADD COLUMN     "emoji" TEXT NOT NULL;
