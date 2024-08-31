-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MENTION', 'LIKE', 'COMMENT', 'COMMENTREACT', 'REPLAYREACT', 'REPLAY', 'FOLLOW', 'SHARE', 'SYSTEM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '6 months';

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "notifierId" INTEGER NOT NULL,
    "notifyingId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "postId" INTEGER,
    "commentId" INTEGER,
    "replayId" INTEGER,
    "shareId" INTEGER,
    "PostReactionId" INTEGER,
    "commentReactionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Share" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ShareToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ShareTopost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_postId_key" ON "Notification"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_commentId_key" ON "Notification"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_replayId_key" ON "Notification"("replayId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_shareId_key" ON "Notification"("shareId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_PostReactionId_key" ON "Notification"("PostReactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_commentReactionId_key" ON "Notification"("commentReactionId");

-- CreateIndex
CREATE INDEX "Notification_notifierId_notifyingId_idx" ON "Notification"("notifierId", "notifyingId");

-- CreateIndex
CREATE UNIQUE INDEX "_ShareToUser_AB_unique" ON "_ShareToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ShareToUser_B_index" ON "_ShareToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShareTopost_AB_unique" ON "_ShareTopost"("A", "B");

-- CreateIndex
CREATE INDEX "_ShareTopost_B_index" ON "_ShareTopost"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_replayId_fkey" FOREIGN KEY ("replayId") REFERENCES "replay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_PostReactionId_fkey" FOREIGN KEY ("PostReactionId") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_commentReactionId_fkey" FOREIGN KEY ("commentReactionId") REFERENCES "reactionsComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifierId_fkey" FOREIGN KEY ("notifierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notifyingId_fkey" FOREIGN KEY ("notifyingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShareToUser" ADD CONSTRAINT "_ShareToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShareToUser" ADD CONSTRAINT "_ShareToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShareTopost" ADD CONSTRAINT "_ShareTopost_A_fkey" FOREIGN KEY ("A") REFERENCES "Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShareTopost" ADD CONSTRAINT "_ShareTopost_B_fkey" FOREIGN KEY ("B") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
