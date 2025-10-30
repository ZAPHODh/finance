'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags } from "@/lib/server/cache";
import { checkIfExpenseTypeLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";
import {
  addRecordToIndex,
  updateRecordInIndex,
  removeRecordFromIndex
} from "@/lib/server/algolia";
import { buildExpenseTypeSearchRecord } from "@/lib/server/algolia-helpers";

const expenseTypeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
});

export interface ExpenseTypeFormData {
  name: string;
  icon?: string;
}

export async function createExpenseType(input: unknown) {
  const data = expenseTypeFormSchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verificar limite do plano
  const limitReached = await checkIfExpenseTypeLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de tipos de despesa do seu plano. Faça upgrade para adicionar mais.");
  }

  const expenseType = await prisma.expenseType.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

  // Add to search index
  await addRecordToIndex(buildExpenseTypeSearchRecord(expenseType));

  revalidateTag(CacheTags.EXPENSE_TYPES);
  revalidatePath("/dashboard/expense-types");
}

export async function updateExpenseType(id: string, input: unknown) {
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

  const updatedExpenseType = await prisma.expenseType.update({
    where: { id },
    data: {
      name: data.name,
      icon: data.icon,
    },
  });

  // Update in search index
  await updateRecordInIndex(buildExpenseTypeSearchRecord(updatedExpenseType));

  revalidateTag(CacheTags.EXPENSE_TYPES);
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

  // Remove from search index
  await removeRecordFromIndex(`expense-type-${id}`);

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
