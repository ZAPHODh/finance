import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/config/site-server";
import { getCurrentSession } from "@/lib/server/auth/session";
import { getUserSubscriptionPlan, stripe } from "@/lib/server/payment";
import { getStripePriceId, getCurrencyFromLocale } from "@/lib/pricing";

export async function GET(req: NextRequest) {
  const locale = req.cookies.get("Next-Locale")?.value || "en";
  const searchParams = req.nextUrl.searchParams;
  const planParam = searchParams.get("plan") || "pro";
  const intervalParam = searchParams.get("interval") || "monthly";

  const config = await siteConfig(locale);
  const billingUrl = config.url + "/dashboard/billing/";
  try {
    const { user, session } = await getCurrentSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      return Response.json({ url: stripeSession.url });
    }

    const currency = getCurrencyFromLocale(locale);
    const planType = planParam === "simple" ? "simple" : "pro";
    const interval = intervalParam === "yearly" ? "yearly" : "monthly";

    const stripePriceId = getStripePriceId(planType, currency, interval);

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
    });
    revalidatePath(`/dashboard/billing`);
    return new Response(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
