/*
  Warnings:

  - You are about to drop the column `description` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ExpenseTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodId` on the `ExpenseTemplate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExpenseTemplate" DROP CONSTRAINT "ExpenseTemplate_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "description",
DROP COLUMN "paymentMethodId";

-- AlterTable
ALTER TABLE "ExpenseTemplate" DROP COLUMN "description",
DROP COLUMN "paymentMethodId";
