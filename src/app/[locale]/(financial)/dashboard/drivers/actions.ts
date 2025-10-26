'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLAN_LIMITS } from "@/config/subscription";
import { CacheTags } from "@/lib/server/cache";

export interface DriverFormData {
  name: string;
}

async function checkIfDriverLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const userWithPlan = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planType: true },
  });

  if (!userWithPlan) throw new Error("User not found");

  const limits = PLAN_LIMITS[userWithPlan.planType];
  if (limits.maxDrivers === -1) return false;

  const count = await prisma.driver.count({
    where: { userId: user.id },
  });

  return count >= limits.maxDrivers;
}

export async function createDriver(data: DriverFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfDriverLimitReached();
  if (limitReached) {
    throw new Error("You have reached the maximum number of drivers for your plan. Please upgrade to add more.");
  }

  await prisma.driver.create({
    data: {
      name: data.name,
      userId: user.id,
    },
  });

  revalidateTag(CacheTags.DRIVERS);
  revalidatePath("/dashboard/drivers");
}

export async function updateDriver(id: string, data: DriverFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const driver = await prisma.driver.findUnique({
    where: { id },
  });

  if (!driver || driver.userId !== user.id) {
    throw new Error("Driver not found or unauthorized");
  }

  await prisma.driver.update({
    where: { id },
    data: {
      name: data.name,
    },
  });

  revalidateTag(CacheTags.DRIVERS);
  revalidatePath("/dashboard/drivers");
}

export async function deleteDriver(id: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const driver = await prisma.driver.findUnique({
    where: { id },
  });

  if (!driver || driver.userId !== user.id) {
    throw new Error("Driver not found or unauthorized");
  }

  await prisma.driver.delete({
    where: { id },
  });

  revalidateTag(CacheTags.DRIVERS);
  revalidatePath("/dashboard/drivers");
}

export async function getDriversData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const drivers = await prisma.driver.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { drivers };
}
