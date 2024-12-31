/*
  Warnings:

  - Added the required column `countryEnum` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `country` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "countryEnum" "Country" NOT NULL,
DROP COLUMN "country",
ADD COLUMN     "country" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
