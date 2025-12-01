import { type NextRequest } from "next/server";
import { buffer } from "node:stream/consumers";
import Stripe from "stripe";
import { prisma } from "@/lib/server/db";
import { stripe } from "@/lib/server/payment";
import { type PlanType } from "@prisma/client";
import { getPlanTypeFromPriceId as getPlanTypeFromPrice } from "@/lib/server/pricing";

async function getPlanTypeFromPriceId(priceId: string): Promise<PlanType> {
  return await getPlanTypeFromPrice(priceId);
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

  // Check if event was already processed (idempotency)
  const existingEvent = await prisma.stripeWebhookEvent.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingEvent?.processed) {
    console.log(`Event ${event.id} already processed, skipping`);
    return new Response(null, { status: 200 });
  }

  await prisma.stripeWebhookEvent.upsert({
    where: { stripeEventId: event.id },
    create: {
      stripeEventId: event.id,
      type: event.type,
      processed: false,
    },
    update: {
      type: event.type,
    },
  });

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

      const subscriptionResponse = await stripe.subscriptions.retrieve(
        session.subscription as string,
        { expand: ['items.data.price'] }
      );

      const subscription = subscriptionResponse as Stripe.Subscription;

      const priceId = typeof subscription.items.data[0]?.price === 'string'
        ? subscription.items.data[0].price
        : subscription.items.data[0]?.price?.id;
      if (!priceId) {
        console.error("No price ID found in subscription");
        return new Response("Invalid subscription data", { status: 400 });
      }

      const planType = await getPlanTypeFromPriceId(priceId);

      try {
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id,
            stripePriceId: priceId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stripeCurrentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
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
      const invoice = event.data.object as Stripe.Invoice;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscriptionId = typeof (invoice as any).subscription === "string"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (invoice as any).subscription
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (invoice as any).subscription?.id;

      if (!subscriptionId) {
        console.error("No subscription in invoice");
        return new Response("No subscription in invoice", { status: 400 });
      }

      const subscriptionResponse = await stripe.subscriptions.retrieve(
        subscriptionId,
        { expand: ['items.data.price'] }
      );

      const subscription = subscriptionResponse as Stripe.Subscription;

      const priceId = typeof subscription.items.data[0]?.price === 'string'
        ? subscription.items.data[0].price
        : subscription.items.data[0]?.price?.id;
      if (!priceId) {
        console.error("No price ID found in subscription");
        return new Response("Invalid subscription data", { status: 400 });
      }

      const planType = await getPlanTypeFromPriceId(priceId);

      try {
        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: priceId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stripeCurrentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
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
      const subscription = event.data.object as Stripe.Subscription;

      const priceItem = subscription.items.data[0];
      const priceId = typeof priceItem?.price === 'string'
        ? priceItem.price
        : priceItem?.price?.id;

      if (!priceId) {
        console.error("No price ID found in subscription update");
        return new Response("Invalid subscription data", { status: 400 });
      }

      const planType = await getPlanTypeFromPriceId(priceId);

      try {
        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: priceId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            stripeCurrentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000) : null,
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

  // Mark event as processed
  await prisma.stripeWebhookEvent.update({
    where: { stripeEventId: event.id },
    data: { processed: true },
  });

  return new Response(null, { status: 200 });
}
