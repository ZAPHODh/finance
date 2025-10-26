/*
  Warnings:

  - You are about to drop the column `companyId` on the `Revenue` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Revenue" DROP CONSTRAINT "Revenue_companyId_fkey";

-- DropIndex
DROP INDEX "public"."Revenue_companyId_date_idx";

-- DropIndex
DROP INDEX "public"."Revenue_companyId_idx";

-- DropIndex
DROP INDEX "public"."Revenue_date_companyId_driverId_idx";

-- AlterTable
ALTER TABLE "Revenue" DROP COLUMN "companyId",
ADD COLUMN     "platformId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."Company";

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Platform_userId_idx" ON "Platform"("userId");

-- CreateIndex
CREATE INDEX "Revenue_platformId_idx" ON "Revenue"("platformId");

-- CreateIndex
CREATE INDEX "Revenue_platformId_date_idx" ON "Revenue"("platformId", "date");

-- CreateIndex
CREATE INDEX "Revenue_date_platformId_driverId_idx" ON "Revenue"("date", "platformId", "driverId");

-- AddForeignKey
ALTER TABLE "Platform" ADD CONSTRAINT "Platform_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE SET NULL ON UPDATE CASCADE;
