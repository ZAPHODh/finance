import { type SubscriptionPlan } from "@/types";
import { type Plan } from "@/types";
import { type PlanType } from "@prisma/client";

// ============================================
// Plan Limits Configuration
// ============================================

export interface PlanLimits {
    maxDrivers: number;
    maxVehicles: number;
    maxCompanies: number;
    maxLaunchesPerMonth: number;
    maxHistoryMonths: number | null; // null = unlimited
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
    },
    SIMPLE: {
        maxDrivers: 3,
        maxVehicles: 3,
        maxCompanies: -1, // unlimited
        maxLaunchesPerMonth: -1,
        maxHistoryMonths: null,
        maxExpenseTypes: -1,
        maxRevenueTypes: -1,
        maxPaymentMethods: -1,
        maxExportsPerMonth: 10,
        maxGoals: 5,
        maxBudgets: 10,
        storageGB: 0.5, // 500MB
        hasExports: true,
        hasAdvancedInsights: true,
        hasAttachments: true,
        hasOCR: false,
        hasReports: true,
        hasReminders: true,
        hasMultiUser: false,
        hasAPIAccess: false,
    },
    PRO: {
        maxDrivers: -1, // unlimited
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
    },
};

// Helper function to check if limit is unlimited
export function isUnlimited(value: number): boolean {
    return value === -1;
}

// ============================================
// Stripe Plan Configuration
// ============================================

export const freePlan: SubscriptionPlan = {
    name: "Free",
    description: "Perfect for solo drivers getting started",
    stripePriceId: "",
};

export const simplePlan: SubscriptionPlan = {
    name: "Simple",
    description: "For professional drivers who want complete control",
    stripePriceId: process.env.STRIPE_SIMPLE_PLAN_ID as string,
};

export const proPlan: SubscriptionPlan = {
    name: "PRO",
    description: "For fleet managers and multi-vehicle operations",
    stripePriceId: process.env.STRIPE_PRO_PLAN_ID as string,
};

// ============================================
// Plan UI Configuration
// ============================================

export const freePlanConfig: Plan = {
    id: "free",
    title: "Free",
    description: "Basic features for personal use",
    currency: "R$",
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
};

export const simplePlanConfig: Plan = {
    id: "simple",
    title: "Simple",
    description: "Essential features for getting started",
    currency: "R$",
    monthlyPrice: "29",
    yearlyPrice: "290",
    buttonText: "Upgrade to Simple",
    badge: "Popular",
    features: [
        { name: "3 drivers", icon: "check" },
        { name: "3 vehicles", icon: "check" },
        { name: "Unlimited companies", icon: "check" },
        { name: "Unlimited entries", icon: "check" },
        { name: "Unlimited history", icon: "check" },
        { name: "Advanced analytics", icon: "check" },
        { name: "10 exports/month (PDF/Excel)", icon: "check" },
        { name: "5 goals tracking", icon: "check" },
        { name: "10 budgets/month", icon: "check" },
        { name: "Advanced insights & alerts", icon: "check" },
        { name: "500MB attachments storage", icon: "check" },
        { name: "All reports", icon: "check" },
        { name: "Reminders", icon: "check" },
        { name: "Priority support (24h)", icon: "check" },
    ],
};

export const proPlanConfig: Plan = {
    id: "pro",
    title: "PRO",
    description: "Advanced features for professionals",
    currency: "R$",
    monthlyPrice: "79",
    yearlyPrice: "790",
    buttonText: "Upgrade to PRO",
    badge: "Best Value",
    highlight: true,
    features: [
        { name: "Unlimited drivers", icon: "check" },
        { name: "Unlimited vehicles", icon: "check" },
        { name: "Unlimited companies", icon: "check" },
        { name: "Unlimited entries", icon: "check" },
        { name: "Unlimited history", icon: "check" },
        { name: "All analytics & insights", icon: "check" },
        { name: "Unlimited exports", icon: "check" },
        { name: "Unlimited goals & budgets", icon: "check" },
        { name: "AI-powered insights", icon: "check" },
        { name: "5GB attachments + OCR", icon: "check" },
        { name: "All reports + scheduling", icon: "check" },
        { name: "Multi-user/team access", icon: "check" },
        { name: "API access", icon: "check" },
        { name: "Live chat + WhatsApp support", icon: "check" },
    ],
};
