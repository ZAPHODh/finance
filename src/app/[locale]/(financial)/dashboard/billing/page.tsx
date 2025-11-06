import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { getUserSubscriptionPlan } from "@/lib/server/payment"
import { BillingPageContent } from "@/components/billing/billing-page-content"
import { freePlanConfig, simplePlanConfig, proPlanConfig } from "@/config/subscription"
import { type CurrentPlan } from "@/types"
import { getScopedI18n } from "@/locales/server"

export default async function BillingPage() {
  const { user } = await getCurrentSession()
  if (!user) redirect("/login")
  const subscriptionPlan = await getUserSubscriptionPlan(user.id)
  const t = await getScopedI18n("ui.userPages.billing")

  const getPlanConfig = () => {
    if (subscriptionPlan.name === "PRO") return proPlanConfig
    if (subscriptionPlan.name === "Simple") return simplePlanConfig
    return freePlanConfig
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

  const allPlans = [freePlanConfig, simplePlanConfig, proPlanConfig]

  return (
    <BillingPageContent
      currentPlan={currentPlan}
      allPlans={allPlans}
      translations={{
        title: t("title"),
        description: t("description"),
        currentPlanTitle: t("currentPlanTitle"),
        currentPlanDescription: t("currentPlanDescription"),
        current: t("current"),
        perMonth: t("perMonth"),
        upgradeToPro: t("upgradeToPro"),
        paymentMethodTitle: t("paymentMethodTitle"),
        paymentMethodDescription: t("paymentMethodDescription"),
        noPaymentMethod: t("noPaymentMethod"),
        addPaymentMethodDescription: t("addPaymentMethodDescription"),
        addPaymentMethod: t("addPaymentMethod"),
        billingHistoryTitle: t("billingHistoryTitle"),
        billingHistoryDescription: t("billingHistoryDescription"),
        noBillingHistory: t("noBillingHistory"),
        manageSubscription: t("manageSubscription"),
      }}
    />
  )
}
