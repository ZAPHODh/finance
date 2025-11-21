"use server"

import { cookies } from "next/headers"
import { siteConfig } from "@/config/site"
import { getCurrentSession } from "@/lib/server/auth/session"
import { getUserSubscriptionPlan, stripe } from "@/lib/server/payment"
import { getStripePriceId, getCurrencyFromLocale } from "@/lib/server/pricing"

export async function createCheckoutSession(
  plan: "simple" | "pro",
  interval: "monthly" | "yearly" = "monthly"
) {
  const cookieStore = await cookies()
  const locale = cookieStore.get("Next-Locale")?.value || "en"
  const billingUrl = siteConfig(locale).url + "/dashboard/billing/"

  try {
    const { user, session } = await getCurrentSession()

    if (!session) {
      return { error: "Unauthorized", url: null }
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      })

      return { url: stripeSession.url, error: null }
    }

    const currency = await getCurrencyFromLocale(locale)
    const stripePriceId = await getStripePriceId(plan, currency, interval)

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email!,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    })

    return { url: stripeSession.url, error: null }
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return { error: "Failed to create checkout session", url: null }
  }
}

export async function openBillingPortal() {
  const cookieStore = await cookies()
  const locale = cookieStore.get("Next-Locale")?.value || "en"
  const billingUrl = siteConfig(locale).url + "/dashboard/billing/"

  try {
    const { user, session } = await getCurrentSession()

    if (!session) {
      return { error: "Unauthorized", url: null }
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    if (!subscriptionPlan.stripeCustomerId) {
      return { error: "No subscription found", url: null }
    }

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: subscriptionPlan.stripeCustomerId,
      return_url: billingUrl,
    })

    return { url: stripeSession.url, error: null }
  } catch (error) {
    console.error("Billing portal error:", error)
    return { error: "Failed to open billing portal", url: null }
  }
}
