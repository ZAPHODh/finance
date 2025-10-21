'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ExpenseTypeFormData {
  name: string;
  icon?: string;
}

export async function createExpenseType(data: ExpenseTypeFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.expenseType.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

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
