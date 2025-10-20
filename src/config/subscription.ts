import { type SubscriptionPlan } from "@/types";
import { type Plan } from "@/types";

export const freePlan: SubscriptionPlan = {
    name: "Free",
    description:
        "",
    stripePriceId: "",
};

export const simplePlan: SubscriptionPlan = {
    name: "Simple",
    description: "",
    stripePriceId: process.env.STRIPE_SIMPLE_PLAN_ID as string,
};

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "",
    stripePriceId: process.env.STRIPE_PRO_PLAN_ID as string,
};

export const freePlanConfig: Plan = {
    id: "free",
    title: "Free",
    description: "Basic features for personal use",
    currency: "$",
    monthlyPrice: "0",
    yearlyPrice: "0",
    buttonText: "Current Plan",
    features: [
        { name: "Basic features", icon: "check" },
        { name: "Community support", icon: "check" },
    ],
};

export const simplePlanConfig: Plan = {
    id: "simple",
    title: "Simple",
    description: "Essential features for getting started",
    currency: "$",
    monthlyPrice: "9",
    yearlyPrice: "90",
    buttonText: "Upgrade to Simple",
    badge: "Popular",
    features: [
        { name: "All Free features", icon: "check" },
        { name: "Priority support", icon: "check" },
        { name: "Advanced analytics", icon: "check" },
    ],
};

export const proPlanConfig: Plan = {
    id: "pro",
    title: "PRO",
    description: "Advanced features for professionals",
    currency: "$",
    monthlyPrice: "29",
    yearlyPrice: "290",
    buttonText: "Upgrade to PRO",
    badge: "Best Value",
    highlight: true,
    features: [
        { name: "All Simple features", icon: "check" },
        { name: "Dedicated support", icon: "check" },
        { name: "Custom integrations", icon: "check" },
        { name: "Advanced security", icon: "check" },
    ],
};
