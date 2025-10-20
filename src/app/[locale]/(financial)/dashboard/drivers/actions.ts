'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface DriverFormData {
  name: string;
}

export async function createDriver(data: DriverFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.driver.create({
    data: {
      name: data.name,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/drivers");
  redirect("/dashboard/drivers");
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

  revalidatePath("/dashboard/drivers");
  redirect("/dashboard/drivers");
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

  revalidatePath("/dashboard/drivers");
}
