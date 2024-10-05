/*
  Warnings:

  - You are about to drop the column `placeholder` on the `ProfilePicture` table. All the data in the column will be lost.
  - You are about to drop the column `placeholder_url` on the `ProfilePicture` table. All the data in the column will be lost.
  - You are about to drop the column `url_with_query` on the `ProfilePicture` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `ProfilePicture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProfilePicture" DROP COLUMN "placeholder",
DROP COLUMN "placeholder_url",
DROP COLUMN "url_with_query",
ADD COLUMN     "profileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';
