'use server';

import { prisma } from "@/lib/server/db";
import { authActionClient } from "@/lib/client/safe-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";
import { cacheWithTag, CacheTags } from "@/lib/server/cache";

const expenseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive(),
  date: z.date(),
  receiptUrl: z.string().url().optional().or(z.literal("")),
  expenseTypeId: z.string().min(1),
  paymentMethodId: z.string().optional(),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
});

export const createExpense = authActionClient
  .metadata({ actionName: "createExpense" })
  .schema(expenseSchema)
  .action(async ({ parsedInput: data }) => {
    await prisma.expense.create({
      data: {
        description: data.description || null,
        amount: data.amount,
        date: data.date,
        receiptUrl: data.receiptUrl || null,
        expenseTypeId: data.expenseTypeId,
        paymentMethodId: data.paymentMethodId || null,
        driverId: data.driverId || null,
        vehicleId: data.vehicleId || null,
      },
    });

    revalidateTag(CacheTags.EXPENSES);
    revalidateTag(CacheTags.DASHBOARD);
    revalidatePath("/dashboard/expenses");
    redirect("/dashboard/expenses");
  });

const updateExpenseSchema = z.object({
  id: z.string().min(1),
  data: expenseSchema,
});

export const updateExpense = authActionClient
  .metadata({ actionName: "updateExpense" })
  .schema(updateExpenseSchema)
  .action(async ({ parsedInput: { id, data }, ctx }) => {
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        expenseType: {
          userId: ctx.userId,
        },
      },
    });

    if (!expense) {
      throw new Error("Expense not found or unauthorized");
    }

    await prisma.expense.update({
      where: { id },
      data: {
        description: data.description || null,
        amount: data.amount,
        date: data.date,
        receiptUrl: data.receiptUrl || null,
        expenseTypeId: data.expenseTypeId,
        paymentMethodId: data.paymentMethodId || null,
        driverId: data.driverId || null,
        vehicleId: data.vehicleId || null,
      },
    });

    revalidateTag(CacheTags.EXPENSES);
    revalidateTag(CacheTags.DASHBOARD);
    revalidatePath("/dashboard/expenses");
    redirect("/dashboard/expenses");
  });

export const deleteExpense = authActionClient
  .metadata({ actionName: "deleteExpense" })
  .schema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        expenseType: {
          userId: ctx.userId,
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
  });

async function getExpensesDataUncached(userId: string) {
  const [expenses, expenseTypes, drivers, vehicles] = await Promise.all([
    prisma.expense.findMany({
      where: {
        expenseType: {
          userId: userId,
        },
      },
      include: {
        expenseType: {
          select: {
            id: true,
            name: true,
          },
        },
        paymentMethod: {
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
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.driver.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.vehicle.findMany({
      where: {
        userId: userId,
      },
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
  const [expenseTypes, paymentMethods, drivers, vehicles] = await Promise.all([
    prisma.expenseType.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.paymentMethod.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.driver.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId: userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { expenseTypes, paymentMethods, drivers, vehicles };
}

const getCachedExpenseFormData = cacheWithTag(
  getExpenseFormDataUncached,
  ['expense-form-data'],
  [CacheTags.EXPENSE_TYPES, CacheTags.PAYMENT_METHODS, CacheTags.DRIVERS, CacheTags.VEHICLES],
  600
)

export async function getExpenseFormData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedExpenseFormData(user.id);
}
