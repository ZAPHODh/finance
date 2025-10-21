'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface RevenueTypeFormData {
  name: string;
  icon?: string;
}

export async function createRevenueType(data: RevenueTypeFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.revenueType.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/revenue-types");
  redirect("/dashboard/revenue-types");
}

export async function updateRevenueType(id: string, data: RevenueTypeFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenueType = await prisma.revenueType.findUnique({
    where: { id },
  });

  if (!revenueType || revenueType.userId !== user.id) {
    throw new Error("Revenue type not found or unauthorized");
  }

  await prisma.revenueType.update({
    where: { id },
    data: {
      name: data.name,
      icon: data.icon,
    },
  });

  revalidatePath("/dashboard/revenue-types");
  redirect("/dashboard/revenue-types");
}

export async function deleteRevenueType(id: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const revenueType = await prisma.revenueType.findUnique({
    where: { id },
  });

  if (!revenueType || revenueType.userId !== user.id) {
    throw new Error("Revenue type not found or unauthorized");
  }

  await prisma.revenueType.delete({
    where: { id },
  });

  revalidatePath("/dashboard/revenue-types");
}

export async function getRevenueTypesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const revenueTypes = await prisma.revenueType.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { revenueTypes };
}
