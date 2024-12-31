/*
  Warnings:

  - You are about to drop the column `format` on the `messageMedia` table. All the data in the column will be lost.
  - You are about to drop the column `media_type` on the `messageMedia` table. All the data in the column will be lost.
  - You are about to drop the column `public_id` on the `messageMedia` table. All the data in the column will be lost.
  - Added the required column `customId` to the `messageMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileHash` to the `messageMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `messageMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `messageMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "messageMedia" DROP COLUMN "format",
DROP COLUMN "media_type",
DROP COLUMN "public_id",
ADD COLUMN     "customId" TEXT NOT NULL,
ADD COLUMN     "fileHash" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
