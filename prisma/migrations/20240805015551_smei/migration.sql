/*
  Warnings:

  - The primary key for the `category_post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `category_post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assigned_by]` on the table `category_post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assigned_by` to the `category_post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "category_post_post_id_key";

-- AlterTable
ALTER TABLE "category_post" DROP CONSTRAINT "category_post_pkey",
DROP COLUMN "id",
ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "assigned_by" INTEGER NOT NULL,
ADD CONSTRAINT "category_post_pkey" PRIMARY KEY ("post_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_post_assigned_by_key" ON "category_post"("assigned_by");

-- AddForeignKey
ALTER TABLE "category_post" ADD CONSTRAINT "category_post_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
