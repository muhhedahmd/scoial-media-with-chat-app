/*
  Warnings:

  - The primary key for the `category_post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignedAt` on the `category_post` table. All the data in the column will be lost.
  - You are about to drop the column `assigned_by` on the `category_post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `category_post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "category_post" DROP CONSTRAINT "category_post_assigned_by_fkey";

-- DropIndex
DROP INDEX "category_post_assigned_by_key";

-- AlterTable
ALTER TABLE "category_post" DROP CONSTRAINT "category_post_pkey",
DROP COLUMN "assignedAt",
DROP COLUMN "assigned_by",
ADD COLUMN     "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "category_post_pkey" PRIMARY KEY ("post_id", "category_id", "id");

-- CreateTable
CREATE TABLE "category_post_User" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_post_id" INTEGER NOT NULL,

    CONSTRAINT "category_post_User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_post_User_user_id_key" ON "category_post_User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_post_User_category_post_id_key" ON "category_post_User"("category_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_post_id_key" ON "category_post"("id");

-- AddForeignKey
ALTER TABLE "category_post_User" ADD CONSTRAINT "category_post_User_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_post_User" ADD CONSTRAINT "category_post_User_category_post_id_fkey" FOREIGN KEY ("category_post_id") REFERENCES "category_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
