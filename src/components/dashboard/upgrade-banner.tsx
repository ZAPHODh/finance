"use client";

import { Banner } from "@/components/billingsdk/banner";
import { useScopedI18n } from "@/locales/client";

export const gradientColors = [
  "rgba(0,149,255,0.56)",
  "rgba(231,77,255,0.77)",
  "rgba(255,0,0,0.73)",
  "rgba(131,255,166,0.66)",
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
