'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ExpenseFormData {
  description?: string;
  amount: number;
  date: Date;
  kmDriven?: number;
  receiptUrl?: string;
  expenseTypeId: string;
  paymentMethodId?: string;
  driverId?: string;
  vehicleId?: string;
}

export async function createExpense(data: ExpenseFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.expense.create({
    data: {
      description: data.description || null,
      amount: data.amount,
      date: data.date,
      kmDriven: data.kmDriven || null,
      receiptUrl: data.receiptUrl || null,
      expenseTypeId: data.expenseTypeId,
      paymentMethodId: data.paymentMethodId || null,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
    },
  });

  revalidatePath("/dashboard/expenses");
  redirect("/dashboard/expenses");
}

export async function updateExpense(id: string, data: ExpenseFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      expenseType: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!expense || expense.expenseType.userId !== user.id) {
    throw new Error("Expense not found or unauthorized");
  }

  await prisma.expense.update({
    where: { id },
    data: {
      description: data.description || null,
      amount: data.amount,
      date: data.date,
      kmDriven: data.kmDriven || null,
      receiptUrl: data.receiptUrl || null,
      expenseTypeId: data.expenseTypeId,
      paymentMethodId: data.paymentMethodId || null,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
    },
  });

  revalidatePath("/dashboard/expenses");
  redirect("/dashboard/expenses");
}

export async function deleteExpense(id: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      expenseType: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!expense || expense.expenseType.userId !== user.id) {
    throw new Error("Expense not found or unauthorized");
  }

  await prisma.expense.delete({
    where: { id },
  });

  revalidatePath("/dashboard/expenses");
}
