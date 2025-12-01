'use server';

import { prisma } from "@/lib/server/db";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { cacheWithTag, CacheTags, invalidateCache } from "@/lib/server/cache";
import { z } from "zod";
import { dailyEntrySchema, type DailyEntryInput } from "@/types/daily-entry";
import { getUserSubscriptionPlan } from "@/lib/server/payment";
import { type Revenue, type Expense } from "@prisma/client";

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
    expenseTypeIds: z.array(z.string()).optional(),
    driverId: z.string().optional(),
    vehicleId: z.string().optional(),
    useSameDriver: z.boolean().optional(),
    useSameVehicle: z.boolean().optional(),
  }).nullable(),
}).refine(
  data => (data.revenue && data.revenue.amount > 0) || (data.expense && data.expense.amount > 0),
  { message: "At least revenue or expense must be filled with amount greater than 0" }
);

export async function createQuickDailyEntry(input: z.infer<typeof quickDailyEntrySchema>) {
  const data = quickDailyEntrySchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: user.id },
    select: { defaultDriverId: true, defaultVehicleId: true }
  });

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
    const created = { revenue: null as Revenue | null, expense: null as Expense | null };

    if (data.revenue && data.revenue.amount > 0) {
      created.revenue = await tx.revenue.create({
        data: {
          amount: data.revenue.amount,
          date: data.date,
          driverId: preferences?.defaultDriverId || null,
          vehicleId: preferences?.defaultVehicleId || null,
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
          driverId: preferences?.defaultDriverId || null,
          vehicleId: preferences?.defaultVehicleId || null,
          expenseTypes: {
            create: [{
              expenseType: { connect: { id: defaultExpenseTypeId! } }
            }]
          }
        },
      });
    }

    return created;
  });

  await invalidateCache(CacheTags.REVENUES);
  await invalidateCache(CacheTags.EXPENSES);
  await invalidateCache(CacheTags.DASHBOARD);
  revalidatePath("/dashboard");

  return results;
}

export async function createCompleteDailyEntry(input: z.infer<typeof completeDailyEntrySchema>) {
  const data = completeDailyEntrySchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let defaultExpenseTypeId: string | undefined;

  if (data.expense && data.expense.amount > 0 && (!data.expense.expenseTypeIds || data.expense.expenseTypeIds.length === 0)) {
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
    const created = { revenue: null as Revenue | null, expense: null as Expense | null };

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
          driverId: expenseDriverId,
          vehicleId: expenseVehicleId,
          expenseTypes: {
            create: [{
              expenseType: { connect: { id: data.expense.expenseTypeIds?.[0] || defaultExpenseTypeId! } }
            }]
          }
        },
      });
    }

    return created;
  });

  await invalidateCache(CacheTags.REVENUES);
  await invalidateCache(CacheTags.EXPENSES);
  await invalidateCache(CacheTags.DASHBOARD);
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

  // First, check user preferences for defaults, then check for isSelf/isPrimary, then count all
  const [preferences, drivers, vehicles, revenues, expenses] = await Promise.all([
    prisma.userPreferences.findUnique({
      where: { userId: user.id },
      select: { defaultDriverId: true, defaultVehicleId: true }
    }),
    prisma.driver.findMany({
      where: { userId: user.id },
      select: { id: true, isSelf: true }
    }),
    prisma.vehicle.findMany({
      where: { userId: user.id },
      select: { id: true, isPrimary: true }
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
        expenseTypes: {
          some: {
            expenseType: {
              userId: user.id
            }
          }
        },
        date: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        expenseTypes: {
          select: {
            expenseTypeId: true
          }
        }
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
    exp.expenseTypes.forEach(et => {
      if (et.expenseTypeId) {
        expenseTypeCounts.set(et.expenseTypeId, (expenseTypeCounts.get(et.expenseTypeId) || 0) + 1);
      }
    });
  });

  const mostUsedPlatforms = Array.from(platformCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  const mostUsedPaymentMethod = Array.from(paymentMethodCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Driver selection hierarchy:
  const selfDriver = drivers.find(d => d.isSelf);
  const mostUsedDriverFromHistory = Array.from(driverCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const mostUsedDriver = preferences?.defaultDriverId
    || (drivers.length === 1 && selfDriver ? selfDriver.id : null)
    || selfDriver?.id
    || mostUsedDriverFromHistory;

  // Vehicle selection hierarchy:
  const primaryVehicle = vehicles.find(v => v.isPrimary);
  const mostUsedVehicleFromHistory = Array.from(vehicleCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const mostUsedVehicle = preferences?.defaultVehicleId
    || (vehicles.length === 1 && primaryVehicle ? primaryVehicle.id : null)
    || primaryVehicle?.id
    || mostUsedVehicleFromHistory;

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
    expenseTypeIds?: string[];
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
        expenseTypes: {
          some: {
            expenseType: {
              userId: user.id
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      include: {
        expenseTypes: {
          select: {
            expenseTypeId: true
          }
        }
      }
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
      expenseTypeIds: lastExpense.expenseTypes.map(et => et.expenseTypeId),
      driverId: lastExpense.driverId,
      vehicleId: lastExpense.vehicleId,
    } : null,
  };
}

// New unified daily entry action
export async function createDailyEntry(input: DailyEntryInput) {
  "use server";

  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get user plan to enforce FREE plan restrictions
  const plan = await getUserSubscriptionPlan(user.id);
  const isFree = plan.name === "FREE";

  // For FREE users, override driver/vehicle with their fixed ones
  if (isFree) {
    const [driver, vehicle] = await Promise.all([
      prisma.driver.findFirst({ where: { userId: user.id }, select: { id: true } }),
      prisma.vehicle.findFirst({ where: { userId: user.id }, select: { id: true } }),
    ]);

    input.driverId = driver?.id;
    input.vehicleId = vehicle?.id;
  }

  const data = dailyEntrySchema.parse(input);

  const results = await prisma.$transaction(async (tx) => {
    const created = {
      revenues: [] as Revenue[],
      expenses: [] as Expense[],
    };

    // Handle Revenue - Sum Mode
    if (data.revenueMode === "sum" && data.totalRevenue && data.platformIds) {
      const revenue = await tx.revenue.create({
        data: {
          amount: data.totalRevenue,
          date: data.date,
          driverId: data.driverId || null,
          vehicleId: data.vehicleId || null,
          paymentMethodId: data.paymentMethodId || null,
          kmDriven: data.kmDriven || null,
          hoursWorked: data.hoursWorked || null,
          platforms: {
            create: data.platformIds.map((platformId) => ({
              platform: { connect: { id: platformId } },
            })),
          },
        },
      });
      created.revenues.push(revenue);
    }

    // Handle Revenue - Individual Mode
    if (data.revenueMode === "individual" && data.revenues) {
      const kmPerRevenue = data.kmDriven ? data.kmDriven / data.revenues.length : null;
      const hoursPerRevenue = data.hoursWorked ? data.hoursWorked / data.revenues.length : null;

      for (const rev of data.revenues) {
        const revenue = await tx.revenue.create({
          data: {
            amount: rev.amount,
            date: data.date,
            driverId: data.driverId || null,
            vehicleId: data.vehicleId || null,
            paymentMethodId: data.paymentMethodId || null,
            kmDriven: kmPerRevenue,
            hoursWorked: hoursPerRevenue,
            platforms: {
              create: [{
                platform: { connect: { id: rev.platformId } },
              }],
            },
          },
        });
        created.revenues.push(revenue);
      }
    }

    // Handle Expense - Sum Mode
    if (data.expenseMode === "sum" && data.totalExpense && data.expenseTypeIds) {
      const expense = await tx.expense.create({
        data: {
          amount: data.totalExpense,
          date: data.date,
          driverId: data.driverId || null,
          vehicleId: data.vehicleId || null,
          expenseTypes: {
            create: data.expenseTypeIds.map(typeId => ({
              expenseType: { connect: { id: typeId } }
            }))
          }
        },
      });
      created.expenses.push(expense);
    }

    // Handle Expense - Individual Mode
    if (data.expenseMode === "individual" && data.expenses) {
      for (const exp of data.expenses) {
        const expense = await tx.expense.create({
          data: {
            amount: exp.amount,
            date: data.date,
            driverId: data.driverId || null,
            vehicleId: data.vehicleId || null,
            expenseTypes: {
              create: [{
                expenseType: { connect: { id: exp.expenseTypeId } }
              }]
            }
          },
        });
        created.expenses.push(expense);
      }
    }

    return created;
  });

  await Promise.all([
    invalidateCache(CacheTags.REVENUES),
    invalidateCache(CacheTags.EXPENSES),
    invalidateCache(CacheTags.DASHBOARD),
  ]);
  revalidatePath("/dashboard");

  return {
    success: true,
    data: results,
  };
}
