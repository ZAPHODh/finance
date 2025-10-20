'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface VehicleFormData {
  name: string;
  plate?: string;
  model?: string;
  year?: number;
}

export async function createVehicle(data: VehicleFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
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

  revalidatePath("/dashboard/vehicles");
  redirect("/dashboard/vehicles");
}

export async function updateVehicle(id: string, data: VehicleFormData) {
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

  revalidatePath("/dashboard/vehicles");
  redirect("/dashboard/vehicles");
}

export async function deleteVehicle(id: string) {
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

  revalidatePath("/dashboard/vehicles");
}
