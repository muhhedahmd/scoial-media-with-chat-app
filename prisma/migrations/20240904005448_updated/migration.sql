/*
  Warnings:

  - A unique constraint covering the columns `[replay_id,innteractId]` on the table `replayLikes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[replay_id,interactionShareId]` on the table `replayLikes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateIndex
CREATE UNIQUE INDEX "replayLikes_replay_id_innteractId_key" ON "replayLikes"("replay_id", "innteractId");

-- CreateIndex
CREATE UNIQUE INDEX "replayLikes_replay_id_interactionShareId_key" ON "replayLikes"("replay_id", "interactionShareId");
