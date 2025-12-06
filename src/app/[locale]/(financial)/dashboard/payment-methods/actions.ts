'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags, invalidateCache } from "@/lib/server/cache";
import { checkIfPaymentMethodLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";
import type { PaymentMethodFormData } from "@/types/forms";
import { FeeType } from "@prisma/client";
import { createPercentageSchema } from "@/lib/validations/common";

const paymentMethodFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  feeType: z.string(),
  feePercentage: z.union([createPercentageSchema(), z.null()]),
  feeFixed: z.union([z.number().min(0, "Fee must be non-negative"), z.null()]),
});

export async function createPaymentMethod(input: PaymentMethodFormData) {
  const data = paymentMethodFormSchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfPaymentMethodLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de formas de pagamento do seu plano. Faça upgrade para adicionar mais.");
  }

  await prisma.paymentMethod.create({
    data: {
      name: data.name,
      feeType: data.feeType as FeeType,
      feePercentage: data.feePercentage,
      feeFixed: data.feeFixed,
      userId: user.id,
    },
  });

  await invalidateCache(CacheTags.PAYMENT_METHODS);
  revalidatePath("/dashboard/payment-methods");
}

export async function updatePaymentMethod(id: string, input: PaymentMethodFormData) {
  const data = paymentMethodFormSchema.parse(input);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const paymentMethod = await prisma.paymentMethod.findUnique({
    where: { id },
  });

  if (!paymentMethod || paymentMethod.userId !== user.id) {
    throw new Error("Payment method not found or unauthorized");
  }

  await prisma.paymentMethod.update({
    where: { id },
    data: {
      name: data.name,
      feeType: data.feeType as FeeType,
      feePercentage: data.feePercentage,
      feeFixed: data.feeFixed,
    },
  });

  await invalidateCache(CacheTags.PAYMENT_METHODS);
  revalidatePath("/dashboard/payment-methods");
}

export async function deletePaymentMethod(id: string) {
  const idSchema = z.string().min(1);
  idSchema.parse(id);
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const paymentMethod = await prisma.paymentMethod.findUnique({
    where: { id },
  });

  if (!paymentMethod || paymentMethod.userId !== user.id) {
    throw new Error("Payment method not found or unauthorized");
  }

  await prisma.paymentMethod.delete({
    where: { id },
  });

  await invalidateCache(CacheTags.PAYMENT_METHODS);
  revalidatePath("/dashboard/payment-methods");
}

export async function getPaymentMethodsData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  const paymentMethods = await prisma.paymentMethod.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { paymentMethods };
}
