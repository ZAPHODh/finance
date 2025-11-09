-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "defaultDriverId" TEXT,
ADD COLUMN     "defaultVehicleId" TEXT;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_defaultDriverId_fkey" FOREIGN KEY ("defaultDriverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_defaultVehicleId_fkey" FOREIGN KEY ("defaultVehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
