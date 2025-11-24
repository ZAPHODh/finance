"use server"

import { cookies } from "next/headers"
import { siteConfig } from "@/config/site"
import { getCurrentSession } from "@/lib/server/auth/session"
import { getUserSubscriptionPlan, stripe } from "@/lib/server/payment"
import { getStripePriceId, getCurrencyFromLocale } from "@/lib/server/pricing"
import { rateLimitByUser } from "@/lib/server/rate-limit"

export async function createCheckoutSession(
  plan: "simple" | "pro",
  interval: "monthly" | "yearly" = "monthly"
) {
  const validPlans = ['simple', 'pro'] as const
  const validIntervals = ['monthly', 'yearly'] as const

  if (!validPlans.includes(plan)) {
    console.error(`Invalid plan attempted: ${plan}`)
    return { error: "Invalid plan", url: null }
  }

  if (!validIntervals.includes(interval)) {
    console.error(`Invalid interval attempted: ${interval}`)
    return { error: "Invalid interval", url: null }
  }

  const { user, session } = await getCurrentSession()

  if (!session) {
    return { error: "Unauthorized", url: null }
  }

  const rateLimitResult = await rateLimitByUser(user.id, 5, "5 m")

  if (!rateLimitResult.success) {
    console.warn(`Rate limit exceeded for createCheckoutSession: userId=${user.id}`)
    return {
      error: `Too many checkout requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
      url: null
    }
  }

  const cookieStore = await cookies()
  const locale = cookieStore.get("Next-Locale")?.value || "en"
  const billingUrl = siteConfig(locale).url + "/dashboard/billing/"

  try {
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
  const { user, session } = await getCurrentSession()

  if (!session) {
    return { error: "Unauthorized", url: null }
  }

  const rateLimitResult = await rateLimitByUser(user.id, 10, "5 m")

  if (!rateLimitResult.success) {
    console.warn(`Rate limit exceeded for openBillingPortal: userId=${user.id}`)
    return {
      error: `Too many billing portal requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
      url: null
    }
  }

  const cookieStore = await cookies()
  const locale = cookieStore.get("Next-Locale")?.value || "en"
  const billingUrl = siteConfig(locale).url + "/dashboard/billing/"

  try {
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
