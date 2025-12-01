-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "fontFamily" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "fontSize" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "highContrast" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keyboardShortcuts" JSONB,
ADD COLUMN     "lineSpacing" TEXT NOT NULL DEFAULT 'normal',
ADD COLUMN     "reducedMotion" BOOLEAN NOT NULL DEFAULT false;
