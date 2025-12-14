import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./_components/onboarding-wizard";
import { getCurrentLocale } from "@/locales/server";
import { getUserSubscriptionPlan } from "@/lib/server/payment";
import { PLAN_LIMITS } from "@/config/subscription";

export default async function OnboardingPage() {
  const { user } = await getCurrentSession();
  const locale = await getCurrentLocale();

  if (!user) {
    redirect("/login");
  }

  if (user.hasCompletedOnboarding) {
    redirect("/dashboard");
  }

  const plan = await getUserSubscriptionPlan(user.id);
  const isFree = plan.name === "Free";
  const planLimits = PLAN_LIMITS[isFree ? "FREE" : plan.name === "Simple" ? "SIMPLE" : "PRO"];

  return (
    <OnboardingWizard
      locale={locale}
      maxDrivers={planLimits.maxDrivers}
      maxVehicles={planLimits.maxVehicles}
    />
  );
}
