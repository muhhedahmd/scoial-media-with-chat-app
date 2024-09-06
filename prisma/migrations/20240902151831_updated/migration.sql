/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Mention` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Mention` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mention" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startPos" DROP NOT NULL,
ALTER COLUMN "startPos" SET DEFAULT 0,
ALTER COLUMN "endPos" DROP NOT NULL,
ALTER COLUMN "endPos" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
