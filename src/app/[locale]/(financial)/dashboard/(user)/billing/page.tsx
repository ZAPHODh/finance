import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getUserSubscriptionPlan } from "@/lib/server/payment"
import { BillingPageContent } from "@/components/billing/billing-page-content"
import { getPlanConfigs } from "@/config/subscription"
import { type CurrentPlan } from "@/types"
import { getCurrentLocale } from "@/locales/server"

export default async function BillingPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")

  const locale = await getCurrentLocale()
  const subscriptionPlan = await getUserSubscriptionPlan(user.id)
  const planConfigs = await getPlanConfigs(locale)

  const getPlanConfig = () => {
    if (subscriptionPlan.name === "PRO") return planConfigs.pro
    if (subscriptionPlan.name === "Simple") return planConfigs.simple
    return planConfigs.free
  }

  const currentPlan: CurrentPlan = {
    plan: getPlanConfig(),
    type: "monthly",
    status: subscriptionPlan.isPro ? "active" : "inactive",
    nextBillingDate: subscriptionPlan.stripeCurrentPeriodEnd
      ? new Date(subscriptionPlan.stripeCurrentPeriodEnd).toLocaleDateString()
      : "N/A",
    paymentMethod: subscriptionPlan.stripeCustomerId ? "Credit Card" : "No payment method",
  }

  const allPlans = [planConfigs.free, planConfigs.simple, planConfigs.pro]

  return (
    <BillingPageContent
      currentPlan={currentPlan}
      allPlans={allPlans}
    />
  )
}
