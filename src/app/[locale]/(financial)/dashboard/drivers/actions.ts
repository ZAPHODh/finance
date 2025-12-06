'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags, invalidateCache } from "@/lib/server/cache";
import { checkIfDriverLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";
import type { DriverFormData } from "@/types/forms";
import { createNameSchema } from "@/lib/validations/common";
import { createCPFSchema, createCNHSchema, createBrazilianPhoneSchema } from "@/lib/validations/brazilian";

const driverFormSchema = z.object({
  name: createNameSchema({ errorMessage: "Name is required" }),
  cpf: createCPFSchema().optional(),
  cnh: createCNHSchema().optional(),
  phone: createBrazilianPhoneSchema().optional(),
});

export async function createDriver(input: DriverFormData) {
  const data = driverFormSchema.parse(input);

  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfDriverLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de motoristas do seu plano. Faça upgrade para adicionar mais.");
  }

  await prisma.driver.create({
    data: {
      name: data.name,
      cpf: data.cpf || null,
      cnh: data.cnh || null,
      phone: data.phone || null,
      userId: user.id,
    },
  });

  await invalidateCache(CacheTags.DRIVERS);
  revalidatePath("/dashboard/drivers");
}

export async function updateDriver(id: string, input: DriverFormData) {
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

  await prisma.driver.update({
    where: { id },
    data: {
      name: data.name,
      cpf: data.cpf || null,
      cnh: data.cnh || null,
      phone: data.phone || null,
    },
  });

  await invalidateCache(CacheTags.DRIVERS);
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

  await invalidateCache(CacheTags.DRIVERS);
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
