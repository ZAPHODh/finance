'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags } from "@/lib/server/cache";
import { checkIfVehicleLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";

const vehicleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  plate: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
});

export interface VehicleFormData {
  name: string;
  plate?: string;
  model?: string;
  year?: number;
}

export async function createVehicle(input: unknown) {
  const data = vehicleFormSchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verificar limite do plano
  const limitReached = await checkIfVehicleLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de veículos do seu plano. Faça upgrade para adicionar mais.");
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      name: data.name,
      plate: data.plate,
      model: data.model,
      year: data.year,
      userId: user.id,
    },
  });

  revalidateTag(CacheTags.VEHICLES);
  revalidatePath("/dashboard/vehicles");
}

export async function updateVehicle(id: string, input: unknown) {
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

  const updatedVehicle = await prisma.vehicle.update({
    where: { id },
    data: {
      name: data.name,
      plate: data.plate,
      model: data.model,
      year: data.year,
    },
  });

  revalidateTag(CacheTags.VEHICLES);
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

  revalidateTag(CacheTags.VEHICLES);
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
