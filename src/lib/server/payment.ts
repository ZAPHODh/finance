import Stripe from "stripe";
import { freePlan, proPlan, simplePlan } from "@/config/subscription";
import { prisma } from "@/lib/server/db";
import { type UserSubscriptionPlan } from "@/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-09-30.clover",
    typescript: true,
});

export async function getUserSubscriptionPlan(
    userId: string
): Promise<UserSubscriptionPlan> {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Check if user has an active subscription
    const isActive = Boolean(
        user.stripePriceId &&
        user.stripeCurrentPeriodEnd &&
        user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    );

    // Determine the plan based on stripePriceId
    let plan = freePlan;
    if (isActive && user.stripePriceId) {
        if (user.stripePriceId === proPlan.stripePriceId) {
            plan = proPlan;
        } else if (user.stripePriceId === simplePlan.stripePriceId) {
            plan = simplePlan;
        }
    }

    const isPro = plan.name === "PRO";

    return {
        ...plan,
        ...user,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime() || 0,
        isPro,
        stripePriceId: user.stripePriceId || "",
    };
}
