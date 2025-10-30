'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags } from "@/lib/server/cache";
import { checkIfDriverLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";
import {
  addRecordToIndex,
  updateRecordInIndex,
  removeRecordFromIndex
} from "@/lib/server/algolia";
import { buildDriverSearchRecord } from "@/lib/server/algolia-helpers";

const driverFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export interface DriverFormData {
  name: string;
}

export async function createDriver(input: unknown) {
  const data = driverFormSchema.parse(input);

  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verificar limite do plano
  const limitReached = await checkIfDriverLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de motoristas do seu plano. Faça upgrade para adicionar mais.");
  }

  const driver = await prisma.driver.create({
    data: {
      name: data.name,
      userId: user.id,
    },
  });

  // Add to search index
  await addRecordToIndex(buildDriverSearchRecord(driver));

  revalidateTag(CacheTags.DRIVERS);
  revalidatePath("/dashboard/drivers");
}

export async function updateDriver(id: string, input: unknown) {
  const data = driverFormSchema.parse(input);

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

  const updatedDriver = await prisma.driver.update({
    where: { id },
    data: {
      name: data.name,
    },
  });

  // Update in search index
  await updateRecordInIndex(buildDriverSearchRecord(updatedDriver));

  revalidateTag(CacheTags.DRIVERS);
  revalidatePath("/dashboard/drivers");
}

export async function deleteDriver(id: string) {
  const idSchema = z.string().min(1);
  idSchema.parse(id);

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

  // Remove from search index
  await removeRecordFromIndex(`driver-${id}`);

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
