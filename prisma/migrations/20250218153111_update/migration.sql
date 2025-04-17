/*
  Warnings:

  - You are about to drop the column `location` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[location_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "location",
ADD COLUMN     "location_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_location_id_key" ON "Profile"("location_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
