'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLAN_LIMITS } from "@/config/subscription";
import { CacheTags } from "@/lib/server/cache";

export interface RevenueTypeFormData {
  name: string;
  icon?: string;
}

async function checkIfRevenueTypeLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const userWithPlan = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planType: true },
  });

  if (!userWithPlan) throw new Error("User not found");

  const limits = PLAN_LIMITS[userWithPlan.planType];
  if (limits.maxRevenueTypes === -1) return false;

  const count = await prisma.revenueType.count({
    where: { userId: user.id },
  });

  return count >= limits.maxRevenueTypes;
}

export async function createRevenueType(data: RevenueTypeFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfRevenueTypeLimitReached();
  if (limitReached) {
    throw new Error("You have reached the maximum number of revenue types for your plan. Please upgrade to add more.");
  }

  await prisma.revenueType.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

  revalidateTag(CacheTags.REVENUE_TYPES);
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

  revalidateTag(CacheTags.REVENUE_TYPES);
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

  revalidateTag(CacheTags.REVENUE_TYPES);
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
