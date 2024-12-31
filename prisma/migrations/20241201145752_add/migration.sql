-- AlterEnum
ALTER TYPE "ChatType" ADD VALUE 'FAST_GROUP';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateTable
CREATE TABLE "groupInvitation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groupInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationHistory" (
    "id" SERIAL NOT NULL,
    "groupInvitationId" INTEGER NOT NULL,
    "previousKey" TEXT NOT NULL,
    "updatedKey" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvitationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groupInvitation_groupId_userId_key" ON "groupInvitation"("groupId", "userId");

-- AddForeignKey
ALTER TABLE "groupInvitation" ADD CONSTRAINT "groupInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupInvitation" ADD CONSTRAINT "groupInvitation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationHistory" ADD CONSTRAINT "InvitationHistory_groupInvitationId_fkey" FOREIGN KEY ("groupInvitationId") REFERENCES "groupInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
