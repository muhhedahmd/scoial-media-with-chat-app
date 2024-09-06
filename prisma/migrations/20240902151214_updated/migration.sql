/*
  Warnings:

  - The primary key for the `Mention` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Mention` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Mention" DROP CONSTRAINT "Mention_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Mention_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
