/*
  Warnings:

  - You are about to drop the column `post_id` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "message" DROP COLUMN "post_id";
