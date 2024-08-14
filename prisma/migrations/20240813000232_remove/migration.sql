/*
  Warnings:

  - You are about to drop the column `isCompleteProfile` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "isCompleteProfile" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isCompleteProfile";
