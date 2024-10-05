-- CreateEnum
CREATE TYPE "ProfilePictureType" AS ENUM ('profile', 'cover');

-- DropForeignKey
ALTER TABLE "Save" DROP CONSTRAINT "Save_InteractionId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "secure_url" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "placeholder_url" TEXT NOT NULL,
    "url_with_query" TEXT NOT NULL,
    "asset_folder" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "tags" TEXT[],
    "type" "ProfilePictureType" NOT NULL,
    "HashBlur" TEXT NOT NULL,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfilePicture" ADD CONSTRAINT "ProfilePicture_id_fkey" FOREIGN KEY ("id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_InteractionId_fkey" FOREIGN KEY ("InteractionId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
