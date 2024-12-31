/*
  Warnings:

  - Added the required column `format` to the `messageMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `messageMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "messageMedia" ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "public_id" TEXT NOT NULL;
