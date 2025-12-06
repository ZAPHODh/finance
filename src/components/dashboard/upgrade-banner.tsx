"use client";

import { useScopedI18n } from "@/locales/client";
import dynamic from "next/dynamic";

const Banner = dynamic(
  () => import("@/components/billingsdk/banner").then(m => ({ default: m.Banner })),
  { ssr: false }
);

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
