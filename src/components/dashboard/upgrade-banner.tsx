"use client";

import { Banner } from "@/components/billingsdk/banner";
import { useScopedI18n } from "@/locales/client";

export const gradientColors = [
  "oklch(0.6716 0.1368 48.5130)",
  "oklch(0.5360 0.0398 196.0280)",
  "oklch(0.6716 0.1368 48.5130)",
  "oklch(0.5360 0.0398 196.0280)",
];

export function UpgradeBanner() {
  const t = useScopedI18n("dashboard.upgradeBanner");

  return (
    <Banner
      title={t("title")}
      description={t("description")}
      buttonText={t("buttonText")}
      buttonLink="/dashboard/billing"
      variant="minimal"
      gradientColors={gradientColors}
    />
  );
}
