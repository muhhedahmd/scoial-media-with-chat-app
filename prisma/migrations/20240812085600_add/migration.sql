/*
  Warnings:

  - You are about to drop the column `gender` on the `Profile` table. All the data in the column will be lost.
  - The `birthdate` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "gender",
DROP COLUMN "birthdate",
ADD COLUMN     "birthdate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE';
