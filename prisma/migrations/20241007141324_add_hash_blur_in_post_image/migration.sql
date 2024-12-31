/*
  Warnings:

  - Added the required column `HashBlur` to the `post_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "post_image" ADD COLUMN     "HashBlur" TEXT NOT NULL;
