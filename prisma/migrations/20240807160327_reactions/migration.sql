/*
  Warnings:

  - You are about to drop the column `like_num` on the `post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('like', 'love', 'haha', 'wow', 'sad', 'angry');

-- AlterTable
ALTER TABLE "post" DROP COLUMN "like_num";

-- CreateTable
CREATE TABLE "commment" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "comment_id" INTEGER NOT NULL,

    CONSTRAINT "commment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "post_id" INTEGER NOT NULL,
    "type" "ReactionType" NOT NULL,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("post_id")
);

-- AddForeignKey
ALTER TABLE "commment" ADD CONSTRAINT "commment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
