import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { getCurrentLocale } from "@/locales/server";

export default async function OnboardingPage() {
  const { user } = await getCurrentSession();
  const locale = await getCurrentLocale();

  if (!user) {
    redirect("/login");
  }

  // If user has already completed onboarding, redirect to dashboard
  if (user.hasCompletedOnboarding) {
    redirect("/dashboard");
  }

  return <OnboardingWizard locale={locale} />;
}
