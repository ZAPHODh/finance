import { type SubscriptionPlan } from "@/types";
import { type Plan } from "@/types";
import { type PlanType } from "@prisma/client";
import { getPricingForLocale } from "@/lib/server/pricing";


export interface PlanLimits {
    maxDrivers: number;
    maxVehicles: number;
    maxCompanies: number;
    maxLaunchesPerMonth: number;
    maxHistoryMonths: number | null;
    maxExpenseTypes: number;
    maxRevenueTypes: number;
    maxPaymentMethods: number;
    maxExportsPerMonth: number;
    maxGoals: number;
    maxBudgets: number;
    storageGB: number;
    hasExports: boolean;
    hasAdvancedInsights: boolean;
    hasAttachments: boolean;
    hasOCR: boolean;
    hasReports: boolean;
    hasReminders: boolean;
    hasMultiUser: boolean;
    hasAPIAccess: boolean;
    hasPeriodComparisons: boolean;
    hasEfficiencyMetrics: boolean;
    hasFleetAnalytics: boolean;
    hasForecasting: boolean;
    hasDriverRankings: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    FREE: {
        maxDrivers: 1,
        maxVehicles: 1,
        maxCompanies: 2,
        maxLaunchesPerMonth: 100,
        maxHistoryMonths: 3,
        maxExpenseTypes: 5,
        maxRevenueTypes: 2,
        maxPaymentMethods: 3,
        maxExportsPerMonth: 0,
        maxGoals: 1,
        maxBudgets: 0,
        storageGB: 0,
        hasExports: false,
        hasAdvancedInsights: false,
        hasAttachments: false,
        hasOCR: false,
        hasReports: false,
        hasReminders: false,
        hasMultiUser: false,
        hasAPIAccess: false,
        hasPeriodComparisons: false,
        hasEfficiencyMetrics: false,
        hasFleetAnalytics: false,
        hasForecasting: false,
        hasDriverRankings: false,
    },
    SIMPLE: {
        maxDrivers: 3,
        maxVehicles: 3,
        maxCompanies: -1,
        maxLaunchesPerMonth: -1,
        maxHistoryMonths: null,
        maxExpenseTypes: -1,
        maxRevenueTypes: -1,
        maxPaymentMethods: -1,
        maxExportsPerMonth: 10,
        maxGoals: 5,
        maxBudgets: 10,
        storageGB: 0.5,
        hasExports: true,
        hasAdvancedInsights: true,
        hasAttachments: true,
        hasOCR: false,
        hasReports: true,
        hasReminders: true,
        hasMultiUser: false,
        hasAPIAccess: false,
        hasPeriodComparisons: true,
        hasEfficiencyMetrics: true,
        hasFleetAnalytics: false,
        hasForecasting: false,
        hasDriverRankings: false,
    },
    PRO: {
        maxDrivers: -1,
        maxVehicles: -1,
        maxCompanies: -1,
        maxLaunchesPerMonth: -1,
        maxHistoryMonths: null,
        maxExpenseTypes: -1,
        maxRevenueTypes: -1,
        maxPaymentMethods: -1,
        maxExportsPerMonth: -1,
        maxGoals: -1,
        maxBudgets: -1,
        storageGB: 5,
        hasExports: true,
        hasAdvancedInsights: true,
        hasAttachments: true,
        hasOCR: true,
        hasReports: true,
        hasReminders: true,
        hasMultiUser: true,
        hasAPIAccess: true,
        hasPeriodComparisons: true,
        hasEfficiencyMetrics: true,
        hasFleetAnalytics: true,
        hasForecasting: true,
        hasDriverRankings: true,
    },
};

export function isUnlimited(value: number): boolean {
    return value === -1;
}


export const freePlan: SubscriptionPlan = {
    name: "Free",
    description: "Perfect for solo drivers getting started",
    stripePriceId: "",
};

export const simplePlan: SubscriptionPlan = {
    name: "Simple",
    description: "For professional drivers who want complete control",
    stripePriceId: process.env.STRIPE_SIMPLE_PLAN_ID || process.env.STRIPE_SIMPLE_BRL_MONTHLY_ID as string,
};

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "For fleet managers and companies with multiple drivers",
    stripePriceId: process.env.STRIPE_PRO_PLAN_ID || process.env.STRIPE_PRO_BRL_MONTHLY_ID as string,
};

export async function getPlanConfigs(locale: string): Promise<{
    free: Plan;
    simple: Plan;
    pro: Plan;
}> {
    const pricing = await getPricingForLocale(locale);

    return {
        free: {
            id: "free",
            title: "Free",
            description: "Basic features for personal use",
            currency: pricing.simple.currencySymbol,
            monthlyPrice: "0",
            yearlyPrice: "0",
            buttonText: "Current Plan",
            features: [
                { name: "1 driver", icon: "check" },
                { name: "1 vehicle", icon: "check" },
                { name: "2 companies (Uber, 99, etc)", icon: "check" },
                { name: "100 entries/month", icon: "check" },
                { name: "3 months history", icon: "check" },
                { name: "Basic dashboard", icon: "check" },
                { name: "5 expense types", icon: "check" },
                { name: "Email support (48h)", icon: "check" },
            ],
        },
        simple: {
            id: "simple",
            title: "Simple",
            description: "Complete financial management for professional drivers",
            currency: pricing.simple.currencySymbol,
            monthlyPrice: pricing.simple.monthlyPrice.toString(),
            yearlyPrice: pricing.simple.yearlyPrice.toString(),
            buttonText: "Upgrade to Simple",
            badge: "Popular",
            features: [
                { name: "Up to 3 drivers & 3 vehicles", icon: "check" },
                { name: "Unlimited companies & entries", icon: "check" },
                { name: "Unlimited history", icon: "check" },
                { name: "Period comparisons & trends", icon: "check" },
                { name: "Efficiency metrics (revenue/km, revenue/hour)", icon: "check" },
                { name: "Net revenue after payment fees", icon: "check" },
                { name: "Maintenance tracking & cost/km", icon: "check" },
                { name: "10 exports/month (PDF/Excel)", icon: "check" },
                { name: "5 goals & 10 budgets tracking", icon: "check" },
                { name: "Smart insights & alerts", icon: "check" },
                { name: "500MB attachments storage", icon: "check" },
                { name: "All reports", icon: "check" },
                { name: "Reminders & notifications", icon: "check" },
                { name: "Priority support (24h)", icon: "check" },
            ],
        },
        pro: {
            id: "pro",
            title: "PRO",
            description: "Fleet management & advanced analytics",
            currency: pricing.pro.currencySymbol,
            monthlyPrice: pricing.pro.monthlyPrice.toString(),
            yearlyPrice: pricing.pro.yearlyPrice.toString(),
            buttonText: "Upgrade to PRO",
            badge: "For Teams",
            highlight: true,
            features: [
                { name: "Unlimited drivers & vehicles", icon: "check" },
                { name: "Fleet dashboard & analytics", icon: "check" },
                { name: "Driver performance rankings", icon: "check" },
                { name: "Vehicle efficiency comparisons", icon: "check" },
                { name: "Platform profitability analysis", icon: "check" },
                { name: "AI-powered insights & forecasting", icon: "check" },
                { name: "Unlimited exports & scheduled reports", icon: "check" },
                { name: "Unlimited goals & budgets", icon: "check" },
                { name: "5GB attachments + OCR", icon: "check" },
                { name: "Multi-user/team access", icon: "check" },
                { name: "Role-based permissions", icon: "check" },
                { name: "API access", icon: "check" },
                { name: "Live chat + WhatsApp support", icon: "check" },
                { name: "Dedicated account manager", icon: "check" },
            ],
        },
    };
}

// Helper to get default plan configs (using "pt" as default locale)
// For dynamic locale-based configs, use getPlanConfigs(locale) directly
export async function getDefaultPlanConfigs() {
    return await getPlanConfigs("pt");
}
