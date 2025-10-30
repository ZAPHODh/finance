'use server';

import { prisma } from "@/lib/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { cacheWithTag, CacheTags } from "@/lib/server/cache";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  addRecordToIndex,
  updateRecordInIndex,
  removeRecordFromIndex
} from "@/lib/server/algolia";
import { buildRevenueSearchRecord } from "@/lib/server/algolia-helpers";

const revenueFormSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.date(),
  kmDriven: z.number().optional(),
  hoursWorked: z.number().optional(),
  platformIds: z.array(z.string()).min(1, "At least one platform is required"),
  paymentMethodId: z.string().optional(),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
});

export type RevenueWithRelations = Prisma.RevenueGetPayload<{
  include: {
    platforms: {
      include: {
        platform: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    paymentMethod: {
      select: {
        id: true;
        name: true;
      };
    };
    driver: {
      select: {
        id: true;
        name: true;
      };
    };
    vehicle: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export interface RevenueFormData {
  amount: number;
  date: Date;
  kmDriven?: number;
  hoursWorked?: number;
  platformIds: string[];
  paymentMethodId?: string;
  driverId?: string;
  vehicleId?: string;
}

export async function createRevenue(input: unknown) {
  const data = revenueFormSchema.parse(input);

  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenue = await prisma.revenue.create({
    data: {
      amount: data.amount,
      date: data.date,
      kmDriven: data.kmDriven || null,
      hoursWorked: data.hoursWorked || null,
      paymentMethodId: data.paymentMethodId || null,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
      platforms: {
        create: data.platformIds.map((platformId) => ({
          platform: { connect: { id: platformId } },
        })),
      },
    },
    include: {
      platforms: {
        include: {
          platform: { select: { name: true } },
        },
      },
      driver: { select: { name: true } },
      vehicle: { select: { name: true } },
    },
  });

  // Add to search index
  await addRecordToIndex(buildRevenueSearchRecord(revenue));

  revalidateTag(CacheTags.REVENUES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/revenues");
}

export async function updateRevenue(id: string, input: unknown) {
  const data = revenueFormSchema.parse(input);

  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenue = await prisma.revenue.findFirst({
    where: {
      id,
      OR: [
        { platforms: { some: { platform: { userId: user.id } } } },
        { driver: { userId: user.id } },
      ],
    },
  });

  if (!revenue) {
    throw new Error("Revenue not found or unauthorized");
  }

  const updatedRevenue = await prisma.revenue.update({
    where: { id },
    data: {
      amount: data.amount,
      date: data.date,
      kmDriven: data.kmDriven || null,
      hoursWorked: data.hoursWorked || null,
      paymentMethodId: data.paymentMethodId || null,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
      platforms: {
        deleteMany: {},
        create: data.platformIds.map((platformId) => ({
          platform: { connect: { id: platformId } },
        })),
      },
    },
    include: {
      platforms: {
        include: {
          platform: { select: { name: true } },
        },
      },
      driver: { select: { name: true } },
      vehicle: { select: { name: true } },
    },
  });

  // Update in search index
  await updateRecordInIndex(buildRevenueSearchRecord(updatedRevenue));

  revalidateTag(CacheTags.REVENUES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/revenues");
}

export async function deleteRevenue(id: string) {
  const idSchema = z.string().min(1);
  idSchema.parse(id);

  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenue = await prisma.revenue.findFirst({
    where: {
      id,
      OR: [
        { platforms: { some: { platform: { userId: user.id } } } },
        { driver: { userId: user.id } },
      ],
    },
  });

  if (!revenue) {
    throw new Error("Revenue not found or unauthorized");
  }

  await prisma.revenue.delete({
    where: { id },
  });

  // Remove from search index
  await removeRecordFromIndex(`revenue-${id}`);

  revalidateTag(CacheTags.REVENUES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/revenues");
}

async function getRevenuesDataUncached(userId: string) {
  const revenues = await prisma.revenue.findMany({
    where: {
      OR: [
        { platforms: { some: { platform: { userId } } } },
        { driver: { userId } },
      ],
    },
    include: {
      platforms: {
        include: {
          platform: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      paymentMethod: {
        select: {
          id: true,
          name: true,
        },
      },
      driver: {
        select: {
          id: true,
          name: true,
        },
      },
      vehicle: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })

  const [companies, drivers, vehicles] = await Promise.all([
    prisma.platform.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.driver.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.vehicle.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return { revenues, platforms: companies, drivers, vehicles };
}

const getCachedRevenuesData = cacheWithTag(
  getRevenuesDataUncached,
  ['revenues-data'],
  [CacheTags.REVENUES, CacheTags.PLATFORMS, CacheTags.DRIVERS, CacheTags.VEHICLES],
  300
)

export async function getRevenuesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedRevenuesData(user.id);
}

async function getRevenueFormDataUncached(userId: string) {
  const [companies, paymentMethods, drivers, vehicles] = await Promise.all([
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
  ]);

  return { platforms: companies, paymentMethods, drivers, vehicles };
}

const getCachedRevenueFormData = cacheWithTag(
  getRevenueFormDataUncached,
  ['revenue-form-data'],
  [CacheTags.PLATFORMS, CacheTags.PAYMENT_METHODS, CacheTags.DRIVERS, CacheTags.VEHICLES],
  600
)

export async function getRevenueFormData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedRevenueFormData(user.id);
}
