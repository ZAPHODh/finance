'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CompanyFormData {
  name: string;
  icon?: string;
}

export async function createCompany(data: CompanyFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.company.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/companies");
  redirect("/dashboard/companies");
}

export async function updateCompany(id: string, data: CompanyFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company || company.userId !== user.id) {
    throw new Error("Company not found or unauthorized");
  }

  await prisma.company.update({
    where: { id },
    data: {
      name: data.name,
      icon: data.icon,
    },
  });

  revalidatePath("/dashboard/companies");
  redirect("/dashboard/companies");
}

export async function deleteCompany(id: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company || company.userId !== user.id) {
    throw new Error("Company not found or unauthorized");
  }

  await prisma.company.delete({
    where: { id },
  });

  revalidatePath("/dashboard/companies");
}
