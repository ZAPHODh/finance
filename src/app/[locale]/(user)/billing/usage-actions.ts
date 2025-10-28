'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { PLAN_LIMITS, isUnlimited } from "@/config/subscription";

export interface UsageLimits {
  planType: string;
  drivers: {
    current: number;
    limit: number;
    unlimited: boolean;
  };
  vehicles: {
    current: number;
    limit: number;
    unlimited: boolean;
  };
  expenseTypes: {
    current: number;
    limit: number;
    unlimited: boolean;
  };
  paymentMethods: {
    current: number;
    limit: number;
    unlimited: boolean;
  };
  platforms: {
    current: number;
    limit: number;
    unlimited: boolean;
  };
  goals: {
    current: number;
    limit: number;
    unlimited: boolean;
  };
  budgets: {
    current: number;
    limit: number;
    unlimited: boolean;
  };
  exports: {
    current: number;
    limit: number;
    unlimited: boolean;
    resetAt: string | null;
  };
}

export async function getUsageLimits(): Promise<UsageLimits> {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const limits = PLAN_LIMITS[user.planType];

  const [
    driversCount,
    vehiclesCount,
    expenseTypesCount,
    paymentMethodsCount,
    platformsCount,
    goalsCount,
    budgetsCount,
  ] = await Promise.all([
    prisma.driver.count({ where: { userId: user.id } }),
    prisma.vehicle.count({ where: { userId: user.id } }),
    prisma.expenseType.count({ where: { userId: user.id } }),
    prisma.paymentMethod.count({ where: { userId: user.id } }),
    prisma.platform.count({ where: { userId: user.id } }),
    prisma.goal.count({ where: { userId: user.id, isActive: true } }),
    prisma.budget.count({ where: { userId: user.id, isActive: true } }),
  ]);

  const userExports = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      monthlyExportCount: true,
      exportCountResetAt: true,
    },
  });

  return {
    planType: user.planType,
    drivers: {
      current: driversCount,
      limit: limits.maxDrivers,
      unlimited: isUnlimited(limits.maxDrivers),
    },
    vehicles: {
      current: vehiclesCount,
      limit: limits.maxVehicles,
      unlimited: isUnlimited(limits.maxVehicles),
    },
    expenseTypes: {
      current: expenseTypesCount,
      limit: limits.maxExpenseTypes,
      unlimited: isUnlimited(limits.maxExpenseTypes),
    },
    paymentMethods: {
      current: paymentMethodsCount,
      limit: limits.maxPaymentMethods,
      unlimited: isUnlimited(limits.maxPaymentMethods),
    },
    platforms: {
      current: platformsCount,
      limit: limits.maxCompanies,
      unlimited: isUnlimited(limits.maxCompanies),
    },
    goals: {
      current: goalsCount,
      limit: limits.maxGoals,
      unlimited: isUnlimited(limits.maxGoals),
    },
    budgets: {
      current: budgetsCount,
      limit: limits.maxBudgets,
      unlimited: isUnlimited(limits.maxBudgets),
    },
    exports: {
      current: userExports?.monthlyExportCount || 0,
      limit: limits.maxExportsPerMonth,
      unlimited: isUnlimited(limits.maxExportsPerMonth),
      resetAt: userExports?.exportCountResetAt?.toISOString() || null,
    },
  };
}
