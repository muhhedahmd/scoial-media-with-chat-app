-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_reciverId_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "reciverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_reciverId_fkey" FOREIGN KEY ("reciverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
