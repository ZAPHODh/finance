-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('NONE', 'PERCENTAGE', 'FIXED', 'BOTH');

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "feeFixed" DOUBLE PRECISION,
ADD COLUMN     "feePercentage" DOUBLE PRECISION,
ADD COLUMN     "feeType" "FeeType" NOT NULL DEFAULT 'NONE';
