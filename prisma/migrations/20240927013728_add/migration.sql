/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `ProfilePicture` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePicture_profileId_key" ON "ProfilePicture"("profileId");
