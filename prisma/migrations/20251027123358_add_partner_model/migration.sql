-- CreateEnum
CREATE TYPE "PartnerCategory" AS ENUM ('FUEL', 'MAINTENANCE', 'INSURANCE', 'PAYMENT', 'PARKING', 'TOLLS', 'CAR_WASH', 'TIRES');

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "PartnerCategory" NOT NULL,
    "logoUrl" TEXT,
    "discountRate" DOUBLE PRECISION,
    "tagline" TEXT NOT NULL,
    "benefit" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "ctaUrl" TEXT NOT NULL,
    "showForPlans" "PlanType"[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Partner_category_idx" ON "Partner"("category");

-- CreateIndex
CREATE INDEX "Partner_active_idx" ON "Partner"("active");
