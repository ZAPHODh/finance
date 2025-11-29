-- CreateIndex
CREATE INDEX "Expense_date_driverId_vehicleId_idx" ON "Expense"("date", "driverId", "vehicleId");

-- CreateIndex
CREATE INDEX "Revenue_date_driverId_vehicleId_idx" ON "Revenue"("date", "driverId", "vehicleId");

-- CreateIndex
CREATE INDEX "WorkLog_date_driverId_vehicleId_idx" ON "WorkLog"("date", "driverId", "vehicleId");
