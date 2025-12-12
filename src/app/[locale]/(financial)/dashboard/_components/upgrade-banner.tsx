"use client";

import { useScopedI18n } from "@/locales/client";
import dynamic from "next/dynamic";

const Banner = dynamic(
  () => import("@/components/billingsdk/banner").then(m => ({ default: m.Banner })),
  { ssr: false }
);



export function UpgradeBanner() {
  const t = useScopedI18n("dashboard.upgradeBanner");

  return (
    <Banner
      title={t("title")}
      description={t("description")}
      buttonText={t("buttonText")}
      buttonLink="/dashboard/billing"
      variant="minimal"
      dismissable={false}
    />
  );
}
