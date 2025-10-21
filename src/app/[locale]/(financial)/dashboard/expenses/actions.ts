'use server';

import { prisma } from "@/lib/server/db";
import { authActionClient } from "@/lib/client/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "@/lib/server/auth/session";
import { redirect } from "next/navigation";

const expenseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive(),
  date: z.date(),
  kmDriven: z.number().positive().optional(),
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
  });

const updateExpenseSchema = z.object({
  id: z.string().min(1),
  data: expenseSchema,
});

export const updateExpense = authActionClient
  .metadata({ actionName: "updateExpense" })
  .schema(updateExpenseSchema)
  .action(async ({ parsedInput: { id, data }, ctx }) => {
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

    if (!expense || expense.expenseType.userId !== ctx.userId) {
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
  });

export const deleteExpense = authActionClient
  .metadata({ actionName: "deleteExpense" })
  .schema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput: { id }, ctx }) => {
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

    if (!expense || expense.expenseType.userId !== ctx.userId) {
      throw new Error("Expense not found or unauthorized");
    }

    await prisma.expense.delete({
      where: { id },
    });

    revalidatePath("/dashboard/expenses");
  });

// Regular server functions (no safe-action needed for server-to-server calls)
export async function getExpensesData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const [expenses, expenseTypes, drivers, vehicles] = await Promise.all([
    prisma.expense.findMany({
      where: {
        expenseType: {
          userId: user.id,
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
        userId: user.id,
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
        userId: user.id,
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
        userId: user.id,
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

export async function getExpenseFormData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const [expenseTypes, paymentMethods, drivers, vehicles] = await Promise.all([
    prisma.expenseType.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.paymentMethod.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.driver.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { userId: user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { expenseTypes, paymentMethods, drivers, vehicles };
}
