'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CacheTags } from "@/lib/server/cache";
import { checkIfPaymentMethodLimitReached } from "@/lib/plans/plan-checker";
import { z } from "zod";
import type { PaymentMethodFormData } from "@/types/forms";

const paymentMethodFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  feeType: z.string(),
  feePercentage: z.number().nullable(),
  feeFixed: z.number().nullable(),
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
      feeType: data.feeType as any,
      feePercentage: data.feePercentage,
      feeFixed: data.feeFixed,
      userId: user.id,
    },
  });

  revalidateTag(CacheTags.PAYMENT_METHODS);
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
      feeType: data.feeType as any,
      feePercentage: data.feePercentage,
      feeFixed: data.feeFixed,
    },
  });

  revalidateTag(CacheTags.PAYMENT_METHODS);
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

  revalidateTag(CacheTags.PAYMENT_METHODS);
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
