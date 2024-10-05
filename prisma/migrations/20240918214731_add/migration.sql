-- CreateEnum
CREATE TYPE "typePin" AS ENUM ('TIME_LINE', 'PROFILE', 'PRIVATE', 'PUBLIC');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InteractionType" ADD VALUE 'SAVE';
ALTER TYPE "InteractionType" ADD VALUE 'PIN';

-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "pinId" INTEGER,
ADD COLUMN     "saveId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateTable
CREATE TABLE "Save" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "save_catagoryId" INTEGER,

    CONSTRAINT "Save_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Save_catagory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Save_catagory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pin" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "type" "typePin" NOT NULL DEFAULT 'PROFILE',
    "tag" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Save_post_id_idx" ON "Save"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Save_post_id_key" ON "Save"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Save_catagory_name_key" ON "Save_catagory"("name");

-- CreateIndex
CREATE INDEX "pin_post_id_idx" ON "pin"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "pin_post_id_key" ON "pin"("post_id");

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_save_catagoryId_fkey" FOREIGN KEY ("save_catagoryId") REFERENCES "Save_catagory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pin" ADD CONSTRAINT "pin_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_pinId_fkey" FOREIGN KEY ("pinId") REFERENCES "pin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "Save"("id") ON DELETE SET NULL ON UPDATE CASCADE;
