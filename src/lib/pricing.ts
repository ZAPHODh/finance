import { type PlanType } from "@prisma/client";

export type Currency = "BRL" | "USD";
export type Locale = "en" | "pt";

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
            yearlyPrice: 80,
            monthlyPriceFormatted: "R$8",
            yearlyPriceFormatted: "R$80",
        },
        pro: {
            currency: "BRL",
            currencySymbol: "R$",
            monthlyPrice: 20,
            yearlyPrice: 200,
            monthlyPriceFormatted: "R$20",
            yearlyPriceFormatted: "R$200",
        },
    },
    USD: {
        simple: {
            currency: "USD",
            currencySymbol: "$",
            monthlyPrice: 2,
            yearlyPrice: 20,
            monthlyPriceFormatted: "$2",
            yearlyPriceFormatted: "$20",
        },
        pro: {
            currency: "USD",
            currencySymbol: "$",
            monthlyPrice: 5,
            yearlyPrice: 50,
            monthlyPriceFormatted: "$5",
            yearlyPriceFormatted: "$50",
        },
    },
};

export function getCurrencyFromLocale(locale: string): Currency {
    return locale === "pt" ? "BRL" : "USD";
}

export function getPricingForLocale(locale: string): PlanPricing {
    const currency = getCurrencyFromLocale(locale);
    return PRICING_CONFIG[currency];
}

export function getPricingForPlan(
    locale: string,
    planType: "simple" | "pro"
): PricingInfo {
    const pricing = getPricingForLocale(locale);
    return pricing[planType];
}

export function formatPrice(amount: number, currency: Currency): string {
    const symbol = PRICING_CONFIG[currency].simple.currencySymbol;
    return `${symbol}${amount}`;
}

export function getStripePriceId(
    planType: "simple" | "pro",
    currency: Currency,
    interval: "monthly" | "yearly"
): string {
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
        case "STRIPE_PRO_BRL_MONTHLY_ID":
            return process.env.STRIPE_PRO_BRL_MONTHLY_ID as string;
        case "STRIPE_PRO_BRL_YEARLY_ID":
            return process.env.STRIPE_PRO_BRL_YEARLY_ID as string;
        case "STRIPE_PRO_USD_MONTHLY_ID":
            return process.env.STRIPE_PRO_USD_MONTHLY_ID as string;
        case "STRIPE_PRO_USD_YEARLY_ID":
            return process.env.STRIPE_PRO_USD_YEARLY_ID as string;
        default:
            throw new Error(`Unknown Stripe price ID key: ${envKey}`);
    }
}

export function getPlanTypeFromPriceId(priceId: string): PlanType {
    const simpleIds = [
        process.env.STRIPE_SIMPLE_BRL_MONTHLY_ID,
        process.env.STRIPE_SIMPLE_BRL_YEARLY_ID,
        process.env.STRIPE_SIMPLE_USD_MONTHLY_ID,
        process.env.STRIPE_SIMPLE_USD_YEARLY_ID,
    ];

    const proIds = [
        process.env.STRIPE_PRO_BRL_MONTHLY_ID,
        process.env.STRIPE_PRO_BRL_YEARLY_ID,
        process.env.STRIPE_PRO_USD_MONTHLY_ID,
        process.env.STRIPE_PRO_USD_YEARLY_ID,
    ];

    if (proIds.includes(priceId)) return "PRO";
    if (simpleIds.includes(priceId)) return "SIMPLE";
    return "FREE";
}
