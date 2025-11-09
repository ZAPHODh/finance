'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags, invalidateCache } from "@/lib/server/cache";
import { checkIfExpenseTypeLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";
import type { ExpenseTypeFormData } from "@/types/forms";

const expenseTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function createExpenseType(input: ExpenseTypeFormData) {
  const data = expenseTypeFormSchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfExpenseTypeLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de tipos de despesa do seu plano. Faça upgrade para adicionar mais.");
  }

  await prisma.expenseType.create({
    data: {
      name: data.name,
      userId: user.id,
    },
  });

  await invalidateCache(CacheTags.EXPENSE_TYPES);
  revalidatePath("/dashboard/expense-types");
}

export async function updateExpenseType(id: string, input: ExpenseTypeFormData) {
  const data = expenseTypeFormSchema.parse(input);
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
    },
  });

  await invalidateCache(CacheTags.EXPENSE_TYPES);
  revalidatePath("/dashboard/expense-types");
}

export async function deleteExpenseType(id: string) {
  const idSchema = z.string().min(1);
  idSchema.parse(id);
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

  await invalidateCache(CacheTags.EXPENSE_TYPES);
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
