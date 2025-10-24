-- CreateIndex
CREATE INDEX "Budget_userId_isActive_period_expenseTypeId_idx" ON "Budget"("userId", "isActive", "period", "expenseTypeId");

-- CreateIndex
CREATE INDEX "Expense_expenseTypeId_date_idx" ON "Expense"("expenseTypeId", "date");

-- CreateIndex
CREATE INDEX "Expense_driverId_date_idx" ON "Expense"("driverId", "date");

-- CreateIndex
CREATE INDEX "Expense_vehicleId_date_idx" ON "Expense"("vehicleId", "date");

-- CreateIndex
CREATE INDEX "Expense_date_expenseTypeId_driverId_idx" ON "Expense"("date", "expenseTypeId", "driverId");

-- CreateIndex
CREATE INDEX "Goal_userId_isActive_period_idx" ON "Goal"("userId", "isActive", "period");

-- CreateIndex
CREATE INDEX "Revenue_companyId_date_idx" ON "Revenue"("companyId", "date");

-- CreateIndex
CREATE INDEX "Revenue_driverId_date_idx" ON "Revenue"("driverId", "date");

-- CreateIndex
CREATE INDEX "Revenue_vehicleId_date_idx" ON "Revenue"("vehicleId", "date");

-- CreateIndex
CREATE INDEX "Revenue_date_companyId_driverId_idx" ON "Revenue"("date", "companyId", "driverId");
