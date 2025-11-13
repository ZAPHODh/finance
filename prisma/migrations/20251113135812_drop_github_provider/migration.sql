/*
  Warnings:

  - You are about to drop the column `githubId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_githubId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubId";
