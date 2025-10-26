'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLAN_LIMITS } from "@/config/subscription";
import { CacheTags } from "@/lib/server/cache";

export interface PlatformFormData {
  name: string;
  icon?: string;
}

async function checkIfPlatformLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const userWithPlan = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planType: true },
  });

  if (!userWithPlan) throw new Error("User not found");

  const limits = PLAN_LIMITS[userWithPlan.planType];
  if (limits.maxCompanies === -1) return false;

  const count = await prisma.platform.count({
    where: { userId: user.id },
  });

  return count >= limits.maxCompanies;
}

export async function createPlatform(data: PlatformFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfPlatformLimitReached();
  if (limitReached) {
    throw new Error("You have reached the maximum number of platforms for your plan. Please upgrade to add more.");
  }

  await prisma.platform.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

  revalidateTag(CacheTags.PLATFORMS);
  revalidatePath("/dashboard/platforms");
}

export async function updatePlatform(id: string, data: PlatformFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const platform = await prisma.platform.findUnique({
    where: { id },
  });

  if (!platform || platform.userId !== user.id) {
    throw new Error("Platform not found or unauthorized");
  }

  await prisma.platform.update({
    where: { id },
    data: {
      name: data.name,
      icon: data.icon,
    },
  });

  revalidateTag(CacheTags.PLATFORMS);
  revalidatePath("/dashboard/platforms");
}

export async function deletePlatform(id: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const platform = await prisma.platform.findUnique({
    where: { id },
  });

  if (!platform || platform.userId !== user.id) {
    throw new Error("Platform not found or unauthorized");
  }

  await prisma.platform.delete({
    where: { id },
  });

  revalidateTag(CacheTags.PLATFORMS);
  revalidatePath("/dashboard/platforms");
}

export async function getPlatformsData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const platforms = await prisma.platform.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { platforms };
}
