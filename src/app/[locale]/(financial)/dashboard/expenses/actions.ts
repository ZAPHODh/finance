'use server';

import { prisma } from "@/lib/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { cacheWithTag, CacheTags } from "@/lib/server/cache";
import { z } from "zod";

const expenseFormSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  date: z.date(),
  expenseTypeId: z.string().min(1, "Expense type is required"),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
});

export interface ExpenseFormData {
  amount: number;
  date: Date;
  expenseTypeId: string;
  driverId?: string;
  vehicleId?: string;
}

export async function createExpense(input: unknown) {
  const data = expenseFormSchema.parse(input);

  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.expense.create({
    data: {
      amount: data.amount,
      date: data.date,
      expenseTypeId: data.expenseTypeId,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
    },
  });

  revalidateTag(CacheTags.EXPENSES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/expenses");
}

export async function updateExpense(id: string, input: unknown) {
  const data = expenseFormSchema.parse(input);

  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const expense = await prisma.expense.findFirst({
    where: {
      id,
      expenseType: {
        userId: user.id,
      },
    },
  });

  if (!expense) {
    throw new Error("Expense not found or unauthorized");
  }

  await prisma.expense.update({
    where: { id },
    data: {
      amount: data.amount,
      date: data.date,
      expenseTypeId: data.expenseTypeId,
      driverId: data.driverId || null,
      vehicleId: data.vehicleId || null,
    },
  });

  revalidateTag(CacheTags.EXPENSES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/expenses");
}

export async function deleteExpense(id: string) {
  const idSchema = z.string().min(1);
  idSchema.parse(id);

  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const expense = await prisma.expense.findFirst({
    where: {
      id,
      expenseType: {
        userId: user.id,
      },
    },
  });

  if (!expense) {
    throw new Error("Expense not found or unauthorized");
  }

  await prisma.expense.delete({
    where: { id },
  });

  revalidateTag(CacheTags.EXPENSES);
  revalidateTag(CacheTags.DASHBOARD);
  revalidatePath("/dashboard/expenses");
}

async function getExpensesDataUncached(userId: string) {
  const [expenses, expenseTypes, drivers, vehicles] = await Promise.all([
    prisma.expense.findMany({
      where: {
        expenseType: {
          userId,
        },
      },
      include: {
        expenseType: {
          select: {
            id: true,
            name: true,
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    }),
    prisma.expenseType.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.driver.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.vehicle.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return { expenses, expenseTypes, drivers, vehicles };
}

const getCachedExpensesData = cacheWithTag(
  getExpensesDataUncached,
  ['expenses-data'],
  [CacheTags.EXPENSES, CacheTags.EXPENSE_TYPES, CacheTags.DRIVERS, CacheTags.VEHICLES],
  300
)

export async function getExpensesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedExpensesData(user.id);
}

async function getExpenseFormDataUncached(userId: string) {
  const [expenseTypes, drivers, vehicles] = await Promise.all([
    prisma.expenseType.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.driver.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { expenseTypes, drivers, vehicles };
}

const getCachedExpenseFormData = cacheWithTag(
  getExpenseFormDataUncached,
  ['expense-form-data'],
  [CacheTags.EXPENSE_TYPES, CacheTags.DRIVERS, CacheTags.VEHICLES],
  600
)

export async function getExpenseFormData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedExpenseFormData(user.id);
}
