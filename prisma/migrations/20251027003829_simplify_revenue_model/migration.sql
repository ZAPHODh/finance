/*
  Warnings:

  - You are about to drop the column `description` on the `Revenue` table. All the data in the column will be lost.
  - You are about to drop the column `platformId` on the `Revenue` table. All the data in the column will be lost.
  - You are about to drop the column `revenueTypeId` on the `Revenue` table. All the data in the column will be lost.
  - You are about to drop the column `tripType` on the `Revenue` table. All the data in the column will be lost.
  - You are about to drop the `RevenueType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Revenue" DROP CONSTRAINT "Revenue_platformId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Revenue" DROP CONSTRAINT "Revenue_revenueTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RevenueType" DROP CONSTRAINT "RevenueType_userId_fkey";

-- DropIndex
DROP INDEX "public"."Revenue_date_platformId_driverId_idx";

-- DropIndex
DROP INDEX "public"."Revenue_platformId_date_idx";

-- DropIndex
DROP INDEX "public"."Revenue_platformId_idx";

-- AlterTable
ALTER TABLE "Revenue" DROP COLUMN "description",
DROP COLUMN "platformId",
DROP COLUMN "revenueTypeId",
DROP COLUMN "tripType";

-- DropTable
DROP TABLE "public"."RevenueType";

-- CreateTable
CREATE TABLE "RevenuePlatform" (
    "id" TEXT NOT NULL,
    "revenueId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenuePlatform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RevenuePlatform_revenueId_idx" ON "RevenuePlatform"("revenueId");

-- CreateIndex
CREATE INDEX "RevenuePlatform_platformId_idx" ON "RevenuePlatform"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "RevenuePlatform_revenueId_platformId_key" ON "RevenuePlatform"("revenueId", "platformId");

-- CreateIndex
CREATE INDEX "Revenue_date_driverId_idx" ON "Revenue"("date", "driverId");

-- AddForeignKey
ALTER TABLE "RevenuePlatform" ADD CONSTRAINT "RevenuePlatform_revenueId_fkey" FOREIGN KEY ("revenueId") REFERENCES "Revenue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenuePlatform" ADD CONSTRAINT "RevenuePlatform_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
