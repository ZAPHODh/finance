"use server";

import { prisma } from "@/lib/server/db";
import { getUserSubscriptionPlan } from "@/lib/server/payment";
import { cacheWithTag } from "@/lib/server/cache";
import { getCurrentSession } from "@/lib/server/auth/session";
import type { PlanType } from "@prisma/client";

interface FreePlanDefaults {
  driver: { id: string; name: string } | null;
  vehicle: { id: string; name: string } | null;
  platforms: Array<{ id: string; name: string }>;
}

interface SmartPlanDefaults {
  drivers: Array<{ id: string; name: string }>;
  vehicles: Array<{ id: string; name: string }>;
  platforms: Array<{ id: string; name: string }>;
  paymentMethods: Array<{ id: string; name: string }>;
  expenseTypes: Array<{ id: string; name: string }>;
  defaultDriverId: string | null;
  defaultVehicleId: string | null;
  defaultPaymentMethodId: string | null;
  mostUsedPlatforms: string[];
}

interface DailyEntryConfig {
  planType: PlanType;
  features: {
    canSelectDriver: boolean;
    canSelectVehicle: boolean;
    canSelectPaymentMethod: boolean;
    maxDrivers: number;
    maxVehicles: number;
  };
  defaults: FreePlanDefaults | SmartPlanDefaults;
}

async function getFreePlanDefaultsUncached(userId: string): Promise<FreePlanDefaults> {
  const [driver, vehicle, platforms] = await Promise.all([
    prisma.driver.findFirst({
      where: { userId },
      select: { id: true, name: true },
    }),
    prisma.vehicle.findFirst({
      where: { userId },
      select: { id: true, name: true },
    }),
    prisma.platform.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    driver,
    vehicle,
    platforms,
  };
}

const getFreePlanDefaults = (userId: string) =>
  cacheWithTag(
    () => getFreePlanDefaultsUncached(userId),
    ["free-plan-defaults", userId],
    [`user-${userId}`, "DRIVERS", "VEHICLES", "PLATFORMS"],
    600 // 10 minutes
  )();

async function getSmartPlanDefaultsUncached(userId: string): Promise<SmartPlanDefaults> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    preferences,
    drivers,
    vehicles,
    platforms,
    paymentMethods,
    expenseTypes,
    platformStats,
    paymentMethodStats,
    driverStats,
    vehicleStats,
    expenseTypeStats,
  ] = await Promise.all([
    prisma.userPreferences.findUnique({
      where: { userId },
      select: {
        defaultDriverId: true,
        defaultVehicleId: true,
      },
    }),
    prisma.driver.findMany({
      where: { userId },
      select: { id: true, name: true, isSelf: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId },
      select: { id: true, name: true, isPrimary: true },
      orderBy: { name: "asc" },
    }),
    prisma.platform.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.paymentMethod.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.expenseType.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),

    // Aggregated statistics using groupBy (much faster!)
    prisma.revenuePlatform.groupBy({
      by: ["platformId"],
      where: {
        revenue: {
          date: { gte: thirtyDaysAgo },
          driver: { userId },
        },
      },
      _count: {
        platformId: true,
      },
      orderBy: {
        _count: {
          platformId: "desc",
        },
      },
      take: 3,
    }),

    prisma.revenue.groupBy({
      by: ["paymentMethodId"],
      where: {
        date: { gte: thirtyDaysAgo },
        driver: { userId },
        paymentMethodId: { not: null },
      },
      _count: {
        paymentMethodId: true,
      },
      orderBy: {
        _count: {
          paymentMethodId: "desc",
        },
      },
      take: 1,
    }),

    prisma.revenue.groupBy({
      by: ["driverId"],
      where: {
        date: { gte: thirtyDaysAgo },
        driver: { userId },
        driverId: { not: null },
      },
      _count: {
        driverId: true,
      },
      orderBy: {
        _count: {
          driverId: "desc",
        },
      },
      take: 1,
    }),

    prisma.revenue.groupBy({
      by: ["vehicleId"],
      where: {
        date: { gte: thirtyDaysAgo },
        driver: { userId },
        vehicleId: { not: null },
      },
      _count: {
        vehicleId: true,
      },
      orderBy: {
        _count: {
          vehicleId: "desc",
        },
      },
      take: 1,
    }),

    prisma.expenseExpenseType.groupBy({
      by: ["expenseTypeId"],
      where: {
        expense: {
          date: { gte: thirtyDaysAgo },
          expenseTypes: {
            some: {
              expenseType: {
                userId
              }
            }
          }
        }
      },
      _count: {
        expenseTypeId: true,
      },
      orderBy: {
        _count: {
          expenseTypeId: "desc",
        },
      },
      take: 1,
    }),
  ]);

  // Apply hierarchy for defaults
  const selfDriver = drivers.find((d) => d.isSelf);
  const primaryVehicle = vehicles.find((v) => v.isPrimary);

  const defaultDriverId =
    preferences?.defaultDriverId ||
    (drivers.length === 1 ? drivers[0].id : null) ||
    selfDriver?.id ||
    (driverStats[0]?.driverId ?? null);

  const defaultVehicleId =
    preferences?.defaultVehicleId ||
    (vehicles.length === 1 ? vehicles[0].id : null) ||
    primaryVehicle?.id ||
    (vehicleStats[0]?.vehicleId ?? null);

  const defaultPaymentMethodId = paymentMethodStats[0]?.paymentMethodId ?? null;

  const mostUsedPlatforms = platformStats.map((stat) => stat.platformId);

  return {
    drivers,
    vehicles,
    platforms,
    paymentMethods,
    expenseTypes,
    defaultDriverId,
    defaultVehicleId,
    defaultPaymentMethodId,
    mostUsedPlatforms,
  };
}

const getSmartPlanDefaults = (userId: string) =>
  cacheWithTag(
    () => getSmartPlanDefaultsUncached(userId),
    ["smart-plan-defaults", userId],
    [
      `user-${userId}`,
      "DRIVERS",
      "VEHICLES",
      "PLATFORMS",
      "PAYMENT_METHODS",
      "EXPENSE_TYPES",
      "REVENUES",
      "EXPENSES",
    ],
    600 // 10 minutes (increased from 2 minutes)
  )();

export async function getDailyEntryConfig(): Promise<DailyEntryConfig> {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const plan = await getUserSubscriptionPlan(user.id);
  const isFree = plan.name === "Free";

  // Get plan limits from config
  const planLimits = await import("@/config/subscription").then(m =>
    m.PLAN_LIMITS[isFree ? "FREE" : plan.name === "Simple" ? "SIMPLE" : "PRO"]
  );

  const defaults = isFree
    ? await getFreePlanDefaults(user.id)
    : await getSmartPlanDefaults(user.id);

  return {
    planType: isFree ? "FREE" : (plan.name === "Simple" ? "SIMPLE" : "PRO"),
    features: {
      canSelectDriver: !isFree,
      canSelectVehicle: !isFree,
      canSelectPaymentMethod: !isFree,
      maxDrivers: planLimits.maxDrivers,
      maxVehicles: planLimits.maxVehicles,
    },
    defaults,
  };
}
