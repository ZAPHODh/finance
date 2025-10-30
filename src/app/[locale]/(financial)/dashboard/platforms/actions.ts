'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags } from "@/lib/server/cache";
import { checkIfPlatformLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";

const platformFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
});

export interface PlatformFormData {
  name: string;
  icon?: string;
}

export async function createPlatform(input: unknown) {
  const data = platformFormSchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verificar limite do plano
  const limitReached = await checkIfPlatformLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de plataformas do seu plano. Faça upgrade para adicionar mais.");
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

export async function updatePlatform(id: string, input: unknown) {
  const data = platformFormSchema.parse(input);
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
  const idSchema = z.string().min(1);
  idSchema.parse(id);
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
