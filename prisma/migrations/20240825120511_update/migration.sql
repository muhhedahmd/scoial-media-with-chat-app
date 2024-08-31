/*
  Warnings:

  - A unique constraint covering the columns `[post_id,user_id]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_post_id_type_user_id_key";

-- DropIndex
DROP INDEX "Reaction_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_post_id_user_id_key" ON "Reaction"("post_id", "user_id");
