/*
  Warnings:

  - You are about to drop the column `icon` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Platform` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "icon";

-- AlterTable
ALTER TABLE "Platform" DROP COLUMN "icon";
