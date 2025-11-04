import { type NextRequest } from "next/server";
import { buffer } from "node:stream/consumers";
import Stripe from "stripe";
import { prisma } from "@/lib/server/db";
import { stripe } from "@/lib/server/payment";
import { simplePlan, proPlan } from "@/config/subscription";
import { type PlanType } from "@prisma/client";
import { getPlanTypeFromPriceId as getPlanTypeFromPrice } from "@/lib/pricing";

function getPlanTypeFromPriceId(priceId: string): PlanType {
  return getPlanTypeFromPrice(priceId);
}

export async function POST(req: NextRequest) {
  //@ts-expect-error Argument of type 'ReadableStream<any>' is not assignable to parameter of type 'ReadableStream | Readable | AsyncIterable<any>'
  const body = await buffer(req.body);
  const headers = req.headers;
  const signature = headers.get("Stripe-Signature") as string;

  let event: Stripe.Event | undefined = undefined;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }
  }

  if (!event) {
    return new Response("No event", { status: 400 });
  }

  console.log(`Processing webhook: ${event.id} - ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session?.metadata?.userId) {
        console.error("Missing userId in session metadata");
        return new Response("Invalid session metadata", { status: 400 });
      }

      if (!session.subscription) {
        console.error("No subscription in session");
        return new Response("No subscription in session", { status: 400 });
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
        { expand: ['items.data.price'] }
      ) as any;

      const priceId = subscription.items.data[0]?.price?.id;
      if (!priceId) {
        console.error("No price ID found in subscription");
        return new Response("Invalid subscription data", { status: 400 });
      }

      const planType = getPlanTypeFromPriceId(priceId);

      try {
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            planType,
          },
        });
        console.log(`User ${session.metadata.userId} subscription created/updated successfully`);
      } catch (error) {
        console.error(`Failed to update user for event ${event.id}:`, error);
        return new Response("Database error", { status: 500 });
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;

      const subscriptionId = typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription?.id;

      if (!subscriptionId) {
        console.error("No subscription in invoice");
        break;
      }

      const subscription = await stripe.subscriptions.retrieve(
        subscriptionId,
        { expand: ['items.data.price'] }
      ) as any;

      const priceId = subscription.items.data[0]?.price?.id;
      if (!priceId) {
        console.error("No price ID found in subscription");
        break;
      }

      const planType = getPlanTypeFromPriceId(priceId);

      try {
        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            planType,
          },
        });
        console.log(`Subscription ${subscription.id} renewed successfully`);
      } catch (error) {
        console.error(`Failed to update user for event ${event.id}:`, error);
        return new Response("Database error", { status: 500 });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as any;

      const priceItem = subscription.items.data[0];
      const priceId = typeof priceItem?.price === 'string'
        ? priceItem.price
        : priceItem?.price?.id;

      if (!priceId) {
        console.error("No price ID found in subscription update");
        break;
      }

      const planType = getPlanTypeFromPriceId(priceId);

      try {
        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            planType,
          },
        });
        console.log(`Subscription ${subscription.id} updated successfully`);
      } catch (error) {
        console.error(`Failed to update user for event ${event.id}:`, error);
        return new Response("Database error", { status: 500 });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      try {
        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            planType: "FREE",
          },
        });
        console.log(`Subscription ${subscription.id} cancelled, user downgraded to FREE`);
      } catch (error) {
        console.error(`Failed to update user for event ${event.id}:`, error);
        return new Response("Database error", { status: 500 });
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
