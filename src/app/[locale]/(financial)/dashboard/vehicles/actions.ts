'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLAN_LIMITS } from "@/config/subscription";
import { CacheTags } from "@/lib/server/cache";

export interface VehicleFormData {
  name: string;
  plate?: string;
  model?: string;
  year?: number;
}

async function checkIfVehicleLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const userWithPlan = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planType: true },
  });

  if (!userWithPlan) throw new Error("User not found");

  const limits = PLAN_LIMITS[userWithPlan.planType];
  if (limits.maxVehicles === -1) return false;

  const count = await prisma.vehicle.count({
    where: { userId: user.id },
  });

  return count >= limits.maxVehicles;
}

export async function createVehicle(data: VehicleFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfVehicleLimitReached();
  if (limitReached) {
    throw new Error("You have reached the maximum number of vehicles for your plan. Please upgrade to add more.");
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

  revalidateTag(CacheTags.VEHICLES);
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

  revalidateTag(CacheTags.VEHICLES);
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
