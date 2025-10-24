-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "ExpenseTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION,
    "expenseTypeId" TEXT NOT NULL,
    "paymentMethodId" TEXT,
    "driverId" TEXT,
    "vehicleId" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "frequency" "RecurrenceFrequency",
    "nextDueDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExpenseTemplate_userId_isActive_idx" ON "ExpenseTemplate"("userId", "isActive");

-- CreateIndex
CREATE INDEX "ExpenseTemplate_userId_isRecurring_nextDueDate_idx" ON "ExpenseTemplate"("userId", "isRecurring", "nextDueDate");

-- AddForeignKey
ALTER TABLE "ExpenseTemplate" ADD CONSTRAINT "ExpenseTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseTemplate" ADD CONSTRAINT "ExpenseTemplate_expenseTypeId_fkey" FOREIGN KEY ("expenseTypeId") REFERENCES "ExpenseType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseTemplate" ADD CONSTRAINT "ExpenseTemplate_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseTemplate" ADD CONSTRAINT "ExpenseTemplate_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseTemplate" ADD CONSTRAINT "ExpenseTemplate_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
