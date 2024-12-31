/*
  Warnings:

  - Added the required column `name` to the `messageMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "messageMedia" ADD COLUMN     "name" TEXT NOT NULL;
