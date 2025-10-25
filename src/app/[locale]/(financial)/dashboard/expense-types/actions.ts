'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLAN_LIMITS } from "@/config/subscription";
import { CacheTags } from "@/lib/server/cache";

export interface ExpenseTypeFormData {
  name: string;
  icon?: string;
}

async function checkIfExpenseTypeLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const userWithPlan = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planType: true },
  });

  if (!userWithPlan) throw new Error("User not found");

  const limits = PLAN_LIMITS[userWithPlan.planType];
  if (limits.maxExpenseTypes === -1) return false;

  const count = await prisma.expenseType.count({
    where: { userId: user.id },
  });

  return count >= limits.maxExpenseTypes;
}

export async function createExpenseType(data: ExpenseTypeFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfExpenseTypeLimitReached();
  if (limitReached) {
    throw new Error("You have reached the maximum number of expense types for your plan. Please upgrade to add more.");
  }

  await prisma.expenseType.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

  revalidateTag(CacheTags.EXPENSE_TYPES);
  revalidatePath("/dashboard/expense-types");
  redirect("/dashboard/expense-types");
}

export async function updateExpenseType(id: string, data: ExpenseTypeFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const expenseType = await prisma.expenseType.findUnique({
    where: { id },
  });

  if (!expenseType || expenseType.userId !== user.id) {
    throw new Error("Expense type not found or unauthorized");
  }

  await prisma.expenseType.update({
    where: { id },
    data: {
      name: data.name,
      icon: data.icon,
    },
  });

  revalidateTag(CacheTags.EXPENSE_TYPES);
  revalidatePath("/dashboard/expense-types");
  redirect("/dashboard/expense-types");
}

export async function deleteExpenseType(id: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const expenseType = await prisma.expenseType.findUnique({
    where: { id },
  });

  if (!expenseType || expenseType.userId !== user.id) {
    throw new Error("Expense type not found or unauthorized");
  }

  await prisma.expenseType.delete({
    where: { id },
  });

  revalidateTag(CacheTags.EXPENSE_TYPES);
  revalidatePath("/dashboard/expense-types");
}

export async function getExpenseTypesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const expenseTypes = await prisma.expenseType.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { expenseTypes };
}
