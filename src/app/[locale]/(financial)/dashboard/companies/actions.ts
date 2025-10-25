'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLAN_LIMITS } from "@/config/subscription";
import { CacheTags } from "@/lib/server/cache";

export interface CompanyFormData {
  name: string;
  icon?: string;
}

async function checkIfCompanyLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const userWithPlan = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planType: true },
  });

  if (!userWithPlan) throw new Error("User not found");

  const limits = PLAN_LIMITS[userWithPlan.planType];
  if (limits.maxCompanies === -1) return false;

  const count = await prisma.company.count({
    where: { userId: user.id },
  });

  return count >= limits.maxCompanies;
}

export async function createCompany(data: CompanyFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfCompanyLimitReached();
  if (limitReached) {
    throw new Error("You have reached the maximum number of companies for your plan. Please upgrade to add more.");
  }

  await prisma.company.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

  revalidateTag(CacheTags.COMPANIES);
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

  revalidateTag(CacheTags.COMPANIES);
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

  revalidateTag(CacheTags.COMPANIES);
  revalidatePath("/dashboard/companies");
}

export async function getCompaniesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const companies = await prisma.company.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { companies };
}
