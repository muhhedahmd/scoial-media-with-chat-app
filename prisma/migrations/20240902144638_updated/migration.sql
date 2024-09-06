/*
  Warnings:

  - You are about to drop the column `postId` on the `Share` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_postId_fkey";

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
