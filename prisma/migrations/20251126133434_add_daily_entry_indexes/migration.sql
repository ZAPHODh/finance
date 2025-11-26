-- CreateIndex
CREATE INDEX "Revenue_paymentMethodId_date_idx" ON "Revenue"("paymentMethodId", "date");

-- CreateIndex
CREATE INDEX "RevenuePlatform_platformId_revenueId_idx" ON "RevenuePlatform"("platformId", "revenueId");
