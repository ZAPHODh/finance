'use server';

import { prisma } from "@/lib/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { cacheWithTag, CacheTags } from "@/lib/server/cache";
import { z } from "zod";

const quickDailyEntrySchema = z.object({
  date: z.date(),
  revenue: z.object({
    amount: z.number().min(0),
    platformIds: z.array(z.string()).min(1, "At least one platform is required"),
  }).nullable(),
  expense: z.object({
    amount: z.number().min(0),
  }).nullable(),
}).refine(
  data => (data.revenue && data.revenue.amount > 0) || (data.expense && data.expense.amount > 0),
  { message: "At least revenue or expense must be filled with amount greater than 0" }
);

const completeDailyEntrySchema = z.object({
  date: z.date(),
  revenue: z.object({
    amount: z.number().min(0),
    platformIds: z.array(z.string()).min(1, "At least one platform is required"),
    driverId: z.string().optional(),
    vehicleId: z.string().optional(),
    paymentMethodId: z.string().optional(),
    kmDriven: z.number().optional(),
    hoursWorked: z.number().optional(),
  }).nullable(),
  expense: z.object({
    amount: z.number().min(0),
    expenseTypeId: z.string().optional(),
    driverId: z.string().optional(),
    vehicleId: z.string().optional(),
    useSameDriver: z.boolean().optional(),
    useSameVehicle: z.boolean().optional(),
  }).nullable(),
}).refine(
  data => (data.revenue && data.revenue.amount > 0) || (data.expense && data.expense.amount > 0),
  { message: "At least revenue or expense must be filled with amount greater than 0" }
);

export interface QuickDailyEntryFormData {
  date: Date;
  revenue: {
    amount: number;
    platformIds: string[];
  } | null;
  expense: {
    amount: number;
  } | null;
}

export interface CompleteDailyEntryFormData {
  date: Date;
  revenue: {
    amount: number;
    platformIds: string[];
    driverId?: string;
    vehicleId?: string;
    paymentMethodId?: string;
    kmDriven?: number;
    hoursWorked?: number;
  } | null;
  expense: {
    amount: number;
    expenseTypeId?: string;
    driverId?: string;
    vehicleId?: string;
    useSameDriver?: boolean;
    useSameVehicle?: boolean;
  } | null;
}

export async function createQuickDailyEntry(input: unknown) {
  const data = quickDailyEntrySchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let defaultExpenseTypeId: string | undefined;

  if (data.expense && data.expense.amount > 0) {
    const defaultExpenseType = await prisma.expenseType.findFirst({
      where: {
        userId: user.id,
        name: { in: ["Despesa Geral", "General Expense", "Geral"] }
      },
      select: { id: true }
    });

    if (!defaultExpenseType) {
      const firstExpenseType = await prisma.expenseType.findFirst({
        where: { userId: user.id },
        select: { id: true },
        orderBy: { createdAt: "asc" }
      });

      if (!firstExpenseType) {
        throw new Error("No expense types found. Please create at least one expense type first.");
      }

      defaultExpenseTypeId = firstExpenseType.id;
    } else {
      defaultExpenseTypeId = defaultExpenseType.id;
    }
  }

  const results = await prisma.$transaction(async (tx) => {
    const created = { revenue: null as any, expense: null as any };

    if (data.revenue && data.revenue.amount > 0) {
      created.revenue = await tx.revenue.create({
        data: {
          amount: data.revenue.amount,
          date: data.date,
          platforms: {
            create: data.revenue.platformIds.map((platformId) => ({
              platform: { connect: { id: platformId } },
            })),
          },
        },
      });
    }

    if (data.expense && data.expense.amount > 0) {
      created.expense = await tx.expense.create({
        data: {
          amount: data.expense.amount,
          date: data.date,
          expenseTypeId: defaultExpenseTypeId!,
        },
      });
    }

    return created;
  });

  revalidateTag(CacheTags.REVENUES);
  revalidateTag(CacheTags.EXPENSES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard");

  return results;
}

export async function createCompleteDailyEntry(input: unknown) {
  const data = completeDailyEntrySchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let defaultExpenseTypeId: string | undefined;

  if (data.expense && data.expense.amount > 0 && !data.expense.expenseTypeId) {
    const defaultExpenseType = await prisma.expenseType.findFirst({
      where: {
        userId: user.id,
        name: { in: ["Despesa Geral", "General Expense", "Geral"] }
      },
      select: { id: true }
    });

    if (!defaultExpenseType) {
      const firstExpenseType = await prisma.expenseType.findFirst({
        where: { userId: user.id },
        select: { id: true },
        orderBy: { createdAt: "asc" }
      });

      if (!firstExpenseType) {
        throw new Error("No expense types found. Please create at least one expense type first.");
      }

      defaultExpenseTypeId = firstExpenseType.id;
    } else {
      defaultExpenseTypeId = defaultExpenseType.id;
    }
  }

  const results = await prisma.$transaction(async (tx) => {
    const created = { revenue: null as any, expense: null as any };

    if (data.revenue && data.revenue.amount > 0) {
      created.revenue = await tx.revenue.create({
        data: {
          amount: data.revenue.amount,
          date: data.date,
          kmDriven: data.revenue.kmDriven || null,
          hoursWorked: data.revenue.hoursWorked || null,
          paymentMethodId: data.revenue.paymentMethodId || null,
          driverId: data.revenue.driverId || null,
          vehicleId: data.revenue.vehicleId || null,
          platforms: {
            create: data.revenue.platformIds.map((platformId) => ({
              platform: { connect: { id: platformId } },
            })),
          },
        },
      });
    }

    if (data.expense && data.expense.amount > 0) {
      const expenseDriverId = data.expense.useSameDriver && data.revenue?.driverId
        ? data.revenue.driverId
        : (data.expense.driverId || null);

      const expenseVehicleId = data.expense.useSameVehicle && data.revenue?.vehicleId
        ? data.revenue.vehicleId
        : (data.expense.vehicleId || null);

      created.expense = await tx.expense.create({
        data: {
          amount: data.expense.amount,
          date: data.date,
          expenseTypeId: data.expense.expenseTypeId || defaultExpenseTypeId!,
          driverId: expenseDriverId,
          vehicleId: expenseVehicleId,
        },
      });
    }

    return created;
  });

  revalidateTag(CacheTags.REVENUES);
  revalidateTag(CacheTags.EXPENSES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard");

  return results;
}

async function getDailyEntryFormDataUncached(userId: string) {
  const [platforms, paymentMethods, drivers, vehicles, expenseTypes] = await Promise.all([
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
    prisma.driver.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.expenseType.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { platforms, paymentMethods, drivers, vehicles, expenseTypes };
}

const getCachedDailyEntryFormData = cacheWithTag(
  getDailyEntryFormDataUncached,
  ['daily-entry-form-data'],
  [CacheTags.PLATFORMS, CacheTags.PAYMENT_METHODS, CacheTags.DRIVERS, CacheTags.VEHICLES, CacheTags.EXPENSE_TYPES],
  600
)

export async function getDailyEntryFormData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedDailyEntryFormData(user.id);
}

export interface SmartDefaults {
  mostUsedPlatforms: string[];
  mostUsedPaymentMethod: string | null;
  mostUsedDriver: string | null;
  mostUsedVehicle: string | null;
  mostUsedExpenseType: string | null;
  averageRevenue: number | null;
}

export async function getSmartDefaults(): Promise<SmartDefaults> {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // First, check for isSelf driver and isPrimary vehicle
  const [selfDriver, primaryVehicle, revenues, expenses] = await Promise.all([
    prisma.driver.findFirst({
      where: { userId: user.id, isSelf: true },
      select: { id: true }
    }),
    prisma.vehicle.findFirst({
      where: { userId: user.id, isPrimary: true },
      select: { id: true }
    }),
    prisma.revenue.findMany({
      where: {
        platforms: {
          some: {
            platform: {
              userId: user.id
            }
          }
        },
        date: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        paymentMethodId: true,
        driverId: true,
        vehicleId: true,
        amount: true,
        platforms: {
          select: {
            platformId: true
          }
        }
      }
    }),
    prisma.expense.findMany({
      where: {
        expenseType: {
          userId: user.id
        },
        date: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        expenseTypeId: true
      }
    })
  ]);

  const platformCounts = new Map<string, number>();
  const paymentMethodCounts = new Map<string, number>();
  const driverCounts = new Map<string, number>();
  const vehicleCounts = new Map<string, number>();
  const expenseTypeCounts = new Map<string, number>();

  revenues.forEach(rev => {
    rev.platforms.forEach(p => {
      platformCounts.set(p.platformId, (platformCounts.get(p.platformId) || 0) + 1);
    });
    if (rev.paymentMethodId) {
      paymentMethodCounts.set(rev.paymentMethodId, (paymentMethodCounts.get(rev.paymentMethodId) || 0) + 1);
    }
    if (rev.driverId) {
      driverCounts.set(rev.driverId, (driverCounts.get(rev.driverId) || 0) + 1);
    }
    if (rev.vehicleId) {
      vehicleCounts.set(rev.vehicleId, (vehicleCounts.get(rev.vehicleId) || 0) + 1);
    }
  });

  expenses.forEach(exp => {
    if (exp.expenseTypeId) {
      expenseTypeCounts.set(exp.expenseTypeId, (expenseTypeCounts.get(exp.expenseTypeId) || 0) + 1);
    }
  });

  const mostUsedPlatforms = Array.from(platformCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  const mostUsedPaymentMethod = Array.from(paymentMethodCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Prioritize isSelf driver over usage history
  const mostUsedDriverFromHistory = Array.from(driverCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const mostUsedDriver = selfDriver?.id || mostUsedDriverFromHistory;

  // Prioritize isPrimary vehicle over usage history
  const mostUsedVehicleFromHistory = Array.from(vehicleCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const mostUsedVehicle = primaryVehicle?.id || mostUsedVehicleFromHistory;

  const mostUsedExpenseType = Array.from(expenseTypeCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const averageRevenue = revenues.length > 0
    ? revenues.reduce((sum, rev) => sum + rev.amount, 0) / revenues.length
    : null;

  return {
    mostUsedPlatforms,
    mostUsedPaymentMethod,
    mostUsedDriver,
    mostUsedVehicle,
    mostUsedExpenseType,
    averageRevenue,
  };
}

export interface LastDailyEntryData {
  revenue: {
    amount: number;
    platformIds: string[];
    driverId?: string | null;
    vehicleId?: string | null;
    paymentMethodId?: string | null;
    kmDriven?: number | null;
    hoursWorked?: number | null;
  } | null;
  expense: {
    amount: number;
    expenseTypeId?: string | null;
    driverId?: string | null;
    vehicleId?: string | null;
  } | null;
}

export async function getLastDailyEntry(): Promise<LastDailyEntryData | null> {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const [lastRevenue, lastExpense] = await Promise.all([
    prisma.revenue.findFirst({
      where: {
        platforms: {
          some: {
            platform: {
              userId: user.id
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      include: {
        platforms: {
          select: {
            platformId: true
          }
        }
      }
    }),
    prisma.expense.findFirst({
      where: {
        expenseType: {
          userId: user.id
        }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  if (!lastRevenue && !lastExpense) {
    return null;
  }

  return {
    revenue: lastRevenue ? {
      amount: lastRevenue.amount,
      platformIds: lastRevenue.platforms.map(p => p.platformId),
      driverId: lastRevenue.driverId,
      vehicleId: lastRevenue.vehicleId,
      paymentMethodId: lastRevenue.paymentMethodId,
      kmDriven: lastRevenue.kmDriven,
      hoursWorked: lastRevenue.hoursWorked,
    } : null,
    expense: lastExpense ? {
      amount: lastExpense.amount,
      expenseTypeId: lastExpense.expenseTypeId,
      driverId: lastExpense.driverId,
      vehicleId: lastExpense.vehicleId,
    } : null,
  };
}
