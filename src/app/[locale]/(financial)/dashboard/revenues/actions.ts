'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface RevenueFormData {
  description?: string;
  amount: number;
  date: Date;
  kmDriven?: number;
  hoursWorked?: number;
  tripType?: string;
  receiptUrl?: string;
  revenueTypeId?: string;
  companyId?: string;
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
      companyId: data.companyId || null,
      paymentMethodId: data.paymentMethodId || null,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
    },
  });

  revalidatePath("/dashboard/revenues");
  redirect("/dashboard/revenues");
}

export async function updateRevenue(id: string, data: RevenueFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenue = await prisma.revenue.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!revenue || revenue.company?.userId !== user.id) {
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
}

export async function deleteRevenue(id: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenue = await prisma.revenue.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!revenue || revenue.company?.userId !== user.id) {
    throw new Error("Revenue not found or unauthorized");
  }

  await prisma.revenue.delete({
    where: { id },
  });

  revalidatePath("/dashboard/revenues");
}
