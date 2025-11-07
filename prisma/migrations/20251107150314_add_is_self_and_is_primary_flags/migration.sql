-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "isSelf" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Driver_userId_isSelf_idx" ON "Driver"("userId", "isSelf");

-- CreateIndex
CREATE INDEX "Vehicle_userId_isPrimary_idx" ON "Vehicle"("userId", "isPrimary");
