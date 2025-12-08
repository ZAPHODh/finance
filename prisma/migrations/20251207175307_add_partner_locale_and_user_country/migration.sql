-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "locales" TEXT[],
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'BR';

-- CreateIndex
CREATE INDEX "Partner_priority_idx" ON "Partner"("priority");
