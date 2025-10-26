'use server';

import { prisma } from "@/lib/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { cacheWithTag, CacheTags } from "@/lib/server/cache";

export interface RevenueFormData {
  description?: string;
  amount: number;
  date: Date;
  kmDriven?: number;
  hoursWorked?: number;
  tripType?: string;
  receiptUrl?: string;
  revenueTypeId?: string;
  platformId?: string;
  paymentMethodId?: string;
  driverId?: string;
  vehicleId?: string;
}

export async function createRevenue(data: RevenueFormData) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.revenue.create({
    data: {
      description: data.description || null,
      amount: data.amount,
      date: data.date,
      kmDriven: data.kmDriven || null,
      hoursWorked: data.hoursWorked || null,
      tripType: data.tripType || null,
      receiptUrl: data.receiptUrl || null,
      revenueTypeId: data.revenueTypeId || null,
      platformId: data.platformId || null,
      paymentMethodId: data.paymentMethodId || null,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
    },
  });

  revalidateTag(CacheTags.REVENUES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/revenues");
}

export async function updateRevenue(id: string, data: RevenueFormData) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenue = await prisma.revenue.findFirst({
    where: {
      id,
      OR: [
        { platform: { userId: user.id } },
        { driver: { userId: user.id } },
      ],
    },
  });

  if (!revenue) {
    throw new Error("Revenue not found or unauthorized");
  }

  await prisma.revenue.update({
    where: { id },
    data: {
      description: data.description || null,
      amount: data.amount,
      date: data.date,
      kmDriven: data.kmDriven || null,
      hoursWorked: data.hoursWorked || null,
      tripType: data.tripType || null,
      receiptUrl: data.receiptUrl || null,
      revenueTypeId: data.revenueTypeId || null,
      platformId: data.platformId || null,
      paymentMethodId: data.paymentMethodId || null,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
    },
  });

  revalidateTag(CacheTags.REVENUES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/revenues");
}

export async function deleteRevenue(id: string) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenue = await prisma.revenue.findFirst({
    where: {
      id,
      OR: [
        { platform: { userId: user.id } },
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

  revalidateTag(CacheTags.REVENUES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/revenues");
}

async function getRevenuesDataUncached(userId: string) {
  const [revenues, revenueTypes, companies, drivers, vehicles] = await Promise.all([
    prisma.revenue.findMany({
      where: {
        OR: [
          {
            platform: {
              userId: userId,
            },
          },
          {
            driver: {
              userId: userId,
            },
          },
        ],
      },
      include: {
        revenueType: {
          select: {
            id: true,
            name: true,
          },
        },
        platform: {
          select: {
            id: true,
            name: true,
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
    }),
    prisma.revenueType.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.platform.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.driver.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.vehicle.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return { revenues, revenueTypes, platforms: companies, drivers, vehicles };
}

const getCachedRevenuesData = cacheWithTag(
  getRevenuesDataUncached,
  ['revenues-data'],
  [CacheTags.REVENUES, CacheTags.REVENUE_TYPES, CacheTags.PLATFORMS, CacheTags.DRIVERS, CacheTags.VEHICLES],
  300
)

export async function getRevenuesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedRevenuesData(user.id);
}

async function getRevenueFormDataUncached(userId: string) {
  const [revenueTypes, companies, paymentMethods, drivers, vehicles] = await Promise.all([
    prisma.revenueType.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.platform.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.paymentMethod.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.driver.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { revenueTypes, platforms: companies, paymentMethods, drivers, vehicles };
}

const getCachedRevenueFormData = cacheWithTag(
  getRevenueFormDataUncached,
  ['revenue-form-data'],
  [CacheTags.REVENUE_TYPES, CacheTags.PLATFORMS, CacheTags.PAYMENT_METHODS, CacheTags.DRIVERS, CacheTags.VEHICLES],
  600
)

export async function getRevenueFormData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedRevenueFormData(user.id);
}
