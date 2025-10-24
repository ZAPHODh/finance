'use server';

import { prisma } from "@/lib/server/db";
import { authActionClient } from "@/lib/client/safe-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { cacheWithTag, CacheTags } from "@/lib/server/cache";

const revenueSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive(),
  date: z.date(),
  kmDriven: z.number().positive().optional(),
  hoursWorked: z.number().positive().optional(),
  tripType: z.string().optional(),
  receiptUrl: z.string().url().optional().or(z.literal("")),
  revenueTypeId: z.string().optional(),
  companyId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
});

export const createRevenue = authActionClient
  .metadata({ actionName: "createRevenue" })
  .schema(revenueSchema)
  .action(async ({ parsedInput: data }) => {
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
        companyId: data.companyId || null,
        paymentMethodId: data.paymentMethodId || null,
        driverId: data.driverId || null,
        vehicleId: data.vehicleId || null,
      },
    });

    revalidateTag(CacheTags.REVENUES);
    revalidateTag(CacheTags.DASHBOARD);
    revalidatePath("/dashboard/revenues");
    redirect("/dashboard/revenues");
  });

const updateRevenueSchema = z.object({
  id: z.string().min(1),
  data: revenueSchema,
});

export const updateRevenue = authActionClient
  .metadata({ actionName: "updateRevenue" })
  .schema(updateRevenueSchema)
  .action(async ({ parsedInput: { id, data }, ctx }) => {
    const revenue = await prisma.revenue.findFirst({
      where: {
        id,
        OR: [
          { company: { userId: ctx.userId } },
          { driver: { userId: ctx.userId } },
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
        companyId: data.companyId || null,
        paymentMethodId: data.paymentMethodId || null,
        driverId: data.driverId || null,
        vehicleId: data.vehicleId || null,
      },
    });

    revalidateTag(CacheTags.REVENUES);
    revalidateTag(CacheTags.DASHBOARD);
    revalidatePath("/dashboard/revenues");
    redirect("/dashboard/revenues");
  });

export const deleteRevenue = authActionClient
  .metadata({ actionName: "deleteRevenue" })
  .schema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const revenue = await prisma.revenue.findFirst({
      where: {
        id,
        OR: [
          { company: { userId: ctx.userId } },
          { driver: { userId: ctx.userId } },
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
  });

async function getRevenuesDataUncached(userId: string) {
  const [revenues, revenueTypes, companies, drivers, vehicles] = await Promise.all([
    prisma.revenue.findMany({
      where: {
        OR: [
          {
            company: {
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
        company: {
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
    prisma.company.findMany({
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

  return { revenues, revenueTypes, companies, drivers, vehicles };
}

const getCachedRevenuesData = cacheWithTag(
  getRevenuesDataUncached,
  ['revenues-data'],
  [CacheTags.REVENUES, CacheTags.REVENUE_TYPES, CacheTags.COMPANIES, CacheTags.DRIVERS, CacheTags.VEHICLES],
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
    prisma.company.findMany({
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

  return { revenueTypes, companies, paymentMethods, drivers, vehicles };
}

const getCachedRevenueFormData = cacheWithTag(
  getRevenueFormDataUncached,
  ['revenue-form-data'],
  [CacheTags.REVENUE_TYPES, CacheTags.COMPANIES, CacheTags.PAYMENT_METHODS, CacheTags.DRIVERS, CacheTags.VEHICLES],
  600
)

export async function getRevenueFormData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedRevenueFormData(user.id);
}
