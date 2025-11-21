'use server';

import { type PlanType } from "@prisma/client";

export type Currency = "BRL" | "USD" | "EUR";
export type Locale = "en" | "pt" | "es" | "fr" | "de" | "it";

export interface PricingInfo {
    currency: Currency;
    currencySymbol: string;
    monthlyPrice: number;
    yearlyPrice: number;
    monthlyPriceFormatted: string;
    yearlyPriceFormatted: string;
}

export interface PlanPricing {
    simple: PricingInfo;
    pro: PricingInfo;
}

const PRICING_CONFIG: Record<Currency, PlanPricing> = {
    BRL: {
        simple: {
            currency: "BRL",
            currencySymbol: "R$",
            monthlyPrice: 8,
            yearlyPrice: 79.68,
            monthlyPriceFormatted: "R$8",
            yearlyPriceFormatted: "R$79.68",
        },
        pro: {
            currency: "BRL",
            currencySymbol: "R$",
            monthlyPrice: 15,
            yearlyPrice: 149.40,
            monthlyPriceFormatted: "R$15",
            yearlyPriceFormatted: "R$149.40",
        },
    },
    USD: {
        simple: {
            currency: "USD",
            currencySymbol: "$",
            monthlyPrice: 8,
            yearlyPrice: 79.68,
            monthlyPriceFormatted: "$8",
            yearlyPriceFormatted: "$79.68",
        },
        pro: {
            currency: "USD",
            currencySymbol: "$",
            monthlyPrice: 15,
            yearlyPrice: 149.40,
            monthlyPriceFormatted: "$15",
            yearlyPriceFormatted: "$149.40",
        },
    },
    EUR: {
        simple: {
            currency: "EUR",
            currencySymbol: "€",
            monthlyPrice: 7,
            yearlyPrice: 69.72,
            monthlyPriceFormatted: "€7",
            yearlyPriceFormatted: "€69.72",
        },
        pro: {
            currency: "EUR",
            currencySymbol: "€",
            monthlyPrice: 14,
            yearlyPrice: 139.44,
            monthlyPriceFormatted: "€14",
            yearlyPriceFormatted: "€139.44",
        },
    },
};

export async function getCurrencyFromLocale(locale: string): Promise<Currency> {
    if (locale === "pt") return "BRL";
    if (["es", "fr", "de", "it"].includes(locale)) return "EUR";
    return "USD";
}

export async function getPricingForLocale(locale: string): Promise<PlanPricing> {
    const currency = await getCurrencyFromLocale(locale);
    return PRICING_CONFIG[currency];
}

export async function getPricingForPlan(
    locale: string,
    planType: "simple" | "pro"
): Promise<PricingInfo> {
    const pricing = await getPricingForLocale(locale);
    return pricing[planType];
}

export async function formatPrice(amount: number, currency: Currency): Promise<string> {
    const symbol = PRICING_CONFIG[currency].simple.currencySymbol;
    return `${symbol}${amount}`;
}

export async function getStripePriceId(
    planType: "simple" | "pro",
    currency: Currency,
    interval: "monthly" | "yearly"
): Promise<string> {
    const envKey = `STRIPE_${planType.toUpperCase()}_${currency}_${interval.toUpperCase()}_ID`;

    switch (envKey) {
        case "STRIPE_SIMPLE_BRL_MONTHLY_ID":
            return process.env.STRIPE_SIMPLE_BRL_MONTHLY_ID as string;
        case "STRIPE_SIMPLE_BRL_YEARLY_ID":
            return process.env.STRIPE_SIMPLE_BRL_YEARLY_ID as string;
        case "STRIPE_SIMPLE_USD_MONTHLY_ID":
            return process.env.STRIPE_SIMPLE_USD_MONTHLY_ID as string;
        case "STRIPE_SIMPLE_USD_YEARLY_ID":
            return process.env.STRIPE_SIMPLE_USD_YEARLY_ID as string;
        case "STRIPE_SIMPLE_EUR_MONTHLY_ID":
            return process.env.STRIPE_SIMPLE_EUR_MONTHLY_ID as string;
        case "STRIPE_SIMPLE_EUR_YEARLY_ID":
            return process.env.STRIPE_SIMPLE_EUR_YEARLY_ID as string;
        case "STRIPE_PRO_BRL_MONTHLY_ID":
            return process.env.STRIPE_PRO_BRL_MONTHLY_ID as string;
        case "STRIPE_PRO_BRL_YEARLY_ID":
            return process.env.STRIPE_PRO_BRL_YEARLY_ID as string;
        case "STRIPE_PRO_USD_MONTHLY_ID":
            return process.env.STRIPE_PRO_USD_MONTHLY_ID as string;
        case "STRIPE_PRO_USD_YEARLY_ID":
            return process.env.STRIPE_PRO_USD_YEARLY_ID as string;
        case "STRIPE_PRO_EUR_MONTHLY_ID":
            return process.env.STRIPE_PRO_EUR_MONTHLY_ID as string;
        case "STRIPE_PRO_EUR_YEARLY_ID":
            return process.env.STRIPE_PRO_EUR_YEARLY_ID as string;
        default:
            throw new Error(`Unknown Stripe price ID key: ${envKey}`);
    }
}

export async function getPlanTypeFromPriceId(priceId: string): Promise<PlanType> {
    const simpleIds = [
        process.env.STRIPE_SIMPLE_BRL_MONTHLY_ID,
        process.env.STRIPE_SIMPLE_BRL_YEARLY_ID,
        process.env.STRIPE_SIMPLE_USD_MONTHLY_ID,
        process.env.STRIPE_SIMPLE_USD_YEARLY_ID,
        process.env.STRIPE_SIMPLE_EUR_MONTHLY_ID,
        process.env.STRIPE_SIMPLE_EUR_YEARLY_ID,
    ];

    const proIds = [
        process.env.STRIPE_PRO_BRL_MONTHLY_ID,
        process.env.STRIPE_PRO_BRL_YEARLY_ID,
        process.env.STRIPE_PRO_USD_MONTHLY_ID,
        process.env.STRIPE_PRO_USD_YEARLY_ID,
        process.env.STRIPE_PRO_EUR_MONTHLY_ID,
        process.env.STRIPE_PRO_EUR_YEARLY_ID,
    ];

    if (proIds.includes(priceId)) return "PRO";
    if (simpleIds.includes(priceId)) return "SIMPLE";
    return "FREE";
}
