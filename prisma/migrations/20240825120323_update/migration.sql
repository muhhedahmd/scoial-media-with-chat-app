/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reaction_user_id_key" ON "Reaction"("user_id");
