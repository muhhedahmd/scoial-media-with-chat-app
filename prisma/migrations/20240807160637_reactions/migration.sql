/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reaction_type_key" ON "Reaction"("type");
