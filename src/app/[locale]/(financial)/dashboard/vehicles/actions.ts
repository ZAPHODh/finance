'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags, invalidateCache } from "@/lib/server/cache";
import { checkIfVehicleLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";
import type { VehicleFormData } from "@/types/forms";
import { createBrazilianPlateSchema } from "@/lib/validations/brazilian";
import { createVehicleYearSchema } from "@/lib/validations/common";

const vehicleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  plate: createBrazilianPlateSchema().optional(),
  model: z.string().optional(),
  year: createVehicleYearSchema().optional(),
});

export async function createVehicle(input: VehicleFormData) {
  const data = vehicleFormSchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }


  const limitReached = await checkIfVehicleLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de veículos do seu plano. Faça upgrade para adicionar mais.");
  }

  await prisma.vehicle.create({
    data: {
      name: data.name,
      plate: data.plate,
      model: data.model,
      year: data.year,
      userId: user.id,
    },
  });

  await invalidateCache(CacheTags.VEHICLES);
  revalidatePath("/dashboard/vehicles");
}

export async function updateVehicle(id: string, input: VehicleFormData) {
  const data = vehicleFormSchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle || vehicle.userId !== user.id) {
    throw new Error("Vehicle not found or unauthorized");
  }

  await prisma.vehicle.update({
    where: { id },
    data: {
      name: data.name,
      plate: data.plate,
      model: data.model,
      year: data.year,
    },
  });

  await invalidateCache(CacheTags.VEHICLES);
  revalidatePath("/dashboard/vehicles");
}

export async function deleteVehicle(id: string) {
  const idSchema = z.string().min(1);
  idSchema.parse(id);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle || vehicle.userId !== user.id) {
    throw new Error("Vehicle not found or unauthorized");
  }

  await prisma.vehicle.delete({
    where: { id },
  });

  await invalidateCache(CacheTags.VEHICLES);
  revalidatePath("/dashboard/vehicles");
}

export async function getVehiclesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const vehicles = await prisma.vehicle.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { vehicles };
}
