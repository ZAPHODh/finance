import { type User } from "@prisma/client";
import { z } from "zod";

export type CurrentUser = {
    id: string;
    name: string;
    email: string;
    picture: string;
};

export interface payload {
    name: string;
    email: string;
    picture?: string;
}

export const settingsSchema = z.object({
    picture: z.string().url(),
    name: z
        .string({
            message: "Please type your name.",
        })
        .min(3, {
            message: "Name must be at least 3 characters.",
        })
        .max(50, {
            message: "Name must be at most 50 characters.",
        }),
    email: z.string().email(),
    shortBio: z.string().optional(),
});

export type SettingsValues = z.infer<typeof settingsSchema>;

export type SubscriptionPlan = {
    name: string;
    description: string;
    stripePriceId: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
    Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
        stripeCurrentPeriodEnd: number;
        isPro: boolean;
    };

export interface SendWelcomeEmailProps {
    toMail: string;
    userName: string;
}

export interface SendOTPProps extends SendWelcomeEmailProps {
    code: string;
}
export interface Plan {
    id: string
    title: string
    description: string
    highlight?: boolean
    type?: 'monthly' | 'yearly'
    currency?: string
    monthlyPrice: string
    yearlyPrice: string
    buttonText: string
    badge?: string
    features: {
        name: string
        icon: string
        iconColor?: string
    }[]
}

export interface CurrentPlan {
    plan: Plan
    type: 'monthly' | 'yearly' | 'custom'
    price?: string
    nextBillingDate: string
    paymentMethod: string
    status: 'active' | 'inactive' | 'past_due' | 'cancelled'
}