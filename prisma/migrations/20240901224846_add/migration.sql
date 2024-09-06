/*
  Warnings:

  - You are about to drop the `_ShareToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShareTopost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ShareToUser" DROP CONSTRAINT "_ShareToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShareToUser" DROP CONSTRAINT "_ShareToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ShareTopost" DROP CONSTRAINT "_ShareTopost_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShareTopost" DROP CONSTRAINT "_ShareTopost_B_fkey";

-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "postId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- DropTable
DROP TABLE "_ShareToUser";

-- DropTable
DROP TABLE "_ShareTopost";

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
