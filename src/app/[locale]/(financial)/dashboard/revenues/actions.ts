'use server';

import { prisma } from "@/lib/server/db";
import { authActionClient } from "@/lib/client/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";

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
    const revenue = await prisma.revenue.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            userId: true,
          },
        },
        driver: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!revenue || (revenue.company?.userId !== ctx.userId && revenue.driver?.userId !== ctx.userId)) {
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

    revalidatePath("/dashboard/revenues");
    redirect("/dashboard/revenues");
  });

export const deleteRevenue = authActionClient
  .metadata({ actionName: "deleteRevenue" })
  .schema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const revenue = await prisma.revenue.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            userId: true,
          },
        },
        driver: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!revenue || (revenue.company?.userId !== ctx.userId && revenue.driver?.userId !== ctx.userId)) {
      throw new Error("Revenue not found or unauthorized");
    }

    await prisma.revenue.delete({
      where: { id },
    });

    revalidatePath("/dashboard/revenues");
  });

export async function getRevenuesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const [revenues, revenueTypes, companies, drivers, vehicles] = await Promise.all([
    prisma.revenue.findMany({
      where: {
        OR: [
          {
            company: {
              userId: user.id,
            },
          },
          {
            driver: {
              userId: user.id,
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
        userId: user.id,
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
        userId: user.id,
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
        userId: user.id,
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
        userId: user.id,
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

export async function getRevenueFormData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const [revenueTypes, companies, paymentMethods, drivers, vehicles] = await Promise.all([
    prisma.revenueType.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.company.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.paymentMethod.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.driver.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { revenueTypes, companies, paymentMethods, drivers, vehicles };
}
