/*
  Warnings:

  - A unique constraint covering the columns `[post_id,type,user_id]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Reaction_post_id_type_key";

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_post_id_type_user_id_key" ON "Reaction"("post_id", "type", "user_id");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
