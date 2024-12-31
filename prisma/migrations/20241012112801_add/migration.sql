/*
  Warnings:

  - You are about to drop the column `flagEmoji` on the `Address` table. All the data in the column will be lost.
  - Added the required column `flag` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "flagEmoji",
ADD COLUMN     "flag" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
