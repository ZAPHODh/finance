import { type SubscriptionPlan } from "@/types";
import { type Plan } from "@/types";
import { type PlanType } from "@prisma/client";
import { getPricingForLocale } from "@/lib/server/pricing";
import { getScopedI18n } from "@/locales/server";


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
    const t = await getScopedI18n("configuration.plans");

    return {
        free: {
            id: "free",
            title: t("free.title"),
            description: t("free.description"),
            currency: pricing.simple.currencySymbol,
            monthlyPrice: "0",
            yearlyPrice: "0",
            buttonText: t("free.buttonText"),
            features: [
                { name: t("free.features.driver"), icon: "check" },
                { name: t("free.features.vehicle"), icon: "check" },
                { name: t("free.features.companies"), icon: "check" },
                { name: t("free.features.entries"), icon: "check" },
                { name: t("free.features.history"), icon: "check" },
                { name: t("free.features.dashboard"), icon: "check" },
                { name: t("free.features.expenseTypes"), icon: "check" },
                { name: t("free.features.support"), icon: "check" },
            ],
        },
        simple: {
            id: "simple",
            title: t("simple.title"),
            description: t("simple.description"),
            currency: pricing.simple.currencySymbol,
            monthlyPrice: pricing.simple.monthlyPrice.toString(),
            yearlyPrice: pricing.simple.yearlyPrice.toString(),
            buttonText: t("simple.buttonText"),
            badge: t("simple.badge"),
            features: [
                { name: t("simple.features.driversVehicles"), icon: "check" },
                { name: t("simple.features.unlimitedCompanies"), icon: "check" },
                { name: t("simple.features.unlimitedHistory"), icon: "check" },
                { name: t("simple.features.comparisons"), icon: "check" },
                { name: t("simple.features.efficiency"), icon: "check" },
                { name: t("simple.features.netRevenue"), icon: "check" },
                { name: t("simple.features.maintenance"), icon: "check" },
                { name: t("simple.features.exports"), icon: "check" },
                { name: t("simple.features.goals"), icon: "check" },
                { name: t("simple.features.insights"), icon: "check" },
                { name: t("simple.features.storage"), icon: "check" },
                { name: t("simple.features.reports"), icon: "check" },
                { name: t("simple.features.reminders"), icon: "check" },
                { name: t("simple.features.support"), icon: "check" },
            ],
        },
        pro: {
            id: "pro",
            title: t("pro.title"),
            description: t("pro.description"),
            currency: pricing.pro.currencySymbol,
            monthlyPrice: pricing.pro.monthlyPrice.toString(),
            yearlyPrice: pricing.pro.yearlyPrice.toString(),
            buttonText: t("pro.buttonText"),
            badge: t("pro.badge"),
            highlight: true,
            features: [
                { name: t("pro.features.unlimitedDrivers"), icon: "check" },
                { name: t("pro.features.fleetDashboard"), icon: "check" },
                { name: t("pro.features.rankings"), icon: "check" },
                { name: t("pro.features.vehicleComparisons"), icon: "check" },
                { name: t("pro.features.platformAnalysis"), icon: "check" },
                { name: t("pro.features.aiInsights"), icon: "check" },
                { name: t("pro.features.unlimitedExports"), icon: "check" },
                { name: t("pro.features.unlimitedGoals"), icon: "check" },
                { name: t("pro.features.storage"), icon: "check" },
                { name: t("pro.features.multiUser"), icon: "check" },
                { name: t("pro.features.permissions"), icon: "check" },
                { name: t("pro.features.api"), icon: "check" },
                { name: t("pro.features.liveSupport"), icon: "check" },
                { name: t("pro.features.accountManager"), icon: "check" },
            ],
        },
    };
}

// Helper to get default plan configs (using "pt" as default locale)
// For dynamic locale-based configs, use getPlanConfigs(locale) directly
export async function getDefaultPlanConfigs() {
    return await getPlanConfigs("pt");
}
