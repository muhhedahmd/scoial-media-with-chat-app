/*
  Warnings:

  - The values [PROFILE,PRIVATE,PUBLIC] on the enum `typePin` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "typePin_new" AS ENUM ('TIME_LINE', 'PRIVATE_PROFILE', 'PUBLIC_PROFILE');
ALTER TABLE "pin" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "pin" ALTER COLUMN "type" TYPE "typePin_new" USING ("type"::text::"typePin_new");
ALTER TYPE "typePin" RENAME TO "typePin_old";
ALTER TYPE "typePin_new" RENAME TO "typePin";
DROP TYPE "typePin_old";
ALTER TABLE "pin" ALTER COLUMN "type" SET DEFAULT 'PUBLIC_PROFILE';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + INTERVAL '6 months';

-- AlterTable
ALTER TABLE "pin" ALTER COLUMN "type" SET DEFAULT 'PUBLIC_PROFILE';
