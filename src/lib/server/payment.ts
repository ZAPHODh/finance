import Stripe from "stripe";
import { freePlan, proPlan, simplePlan, PLAN_LIMITS, type PlanLimits } from "@/config/subscription";
import { prisma } from "@/lib/server/db";
import { type UserSubscriptionPlan } from "@/types";
import { type PlanType } from "@prisma/client";
import { getPlanTypeFromPriceId } from "@/lib/server/pricing";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-11-17.clover",
    typescript: true,
});

export async function getUserSubscriptionPlan(
    userId: string
): Promise<UserSubscriptionPlan> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
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

    const isActive = Boolean(
        user.stripePriceId &&
        user.stripeCurrentPeriodEnd &&
        user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
    );

    let plan = freePlan;
    if (isActive && user.stripePriceId) {
        const planType = await getPlanTypeFromPriceId(user.stripePriceId);

        if (planType === "PRO") {
            plan = proPlan;
        } else if (planType === "SIMPLE") {
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

export function getPlanLimits(planName: string): PlanLimits {
    const normalized = planName.toUpperCase() as PlanType;
    return PLAN_LIMITS[normalized] || PLAN_LIMITS.FREE;
}
