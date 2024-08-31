/*
  Warnings:

  - You are about to drop the column `emoji` on the `reactionsComment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;

-- AlterTable
ALTER TABLE "reactionsComment" DROP COLUMN "emoji";
