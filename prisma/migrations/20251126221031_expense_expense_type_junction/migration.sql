-- CreateTable: ExpenseExpenseType junction table
CREATE TABLE "ExpenseExpenseType" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "expenseTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpenseExpenseType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExpenseExpenseType_expenseId_idx" ON "ExpenseExpenseType"("expenseId");

-- CreateIndex
CREATE INDEX "ExpenseExpenseType_expenseTypeId_idx" ON "ExpenseExpenseType"("expenseTypeId");

-- CreateIndex
CREATE INDEX "ExpenseExpenseType_expenseTypeId_expenseId_idx" ON "ExpenseExpenseType"("expenseTypeId", "expenseId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseExpenseType_expenseId_expenseTypeId_key" ON "ExpenseExpenseType"("expenseId", "expenseTypeId");

-- Migrate existing data: Copy expense -> expenseType relationships to junction table
INSERT INTO "ExpenseExpenseType" ("id", "expenseId", "expenseTypeId", "createdAt")
SELECT
    gen_random_uuid()::text,
    "id",
    "expenseTypeId",
    CURRENT_TIMESTAMP
FROM "Expense"
WHERE "expenseTypeId" IS NOT NULL;

-- DropIndex: Remove old indexes that reference expenseTypeId
DROP INDEX IF EXISTS "Expense_expenseTypeId_idx";
DROP INDEX IF EXISTS "Expense_expenseTypeId_date_idx";
DROP INDEX IF EXISTS "Expense_date_expenseTypeId_driverId_idx";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT IF EXISTS "Expense_expenseTypeId_fkey";

-- AlterTable: Remove expenseTypeId column from Expense
ALTER TABLE "Expense" DROP COLUMN "expenseTypeId";

-- AddForeignKey: Add foreign keys for junction table
ALTER TABLE "ExpenseExpenseType" ADD CONSTRAINT "ExpenseExpenseType_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExpenseExpenseType" ADD CONSTRAINT "ExpenseExpenseType_expenseTypeId_fkey" FOREIGN KEY ("expenseTypeId") REFERENCES "ExpenseType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
