'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLAN_LIMITS } from "@/config/subscription";
import { CacheTags } from "@/lib/server/cache";

export interface PaymentMethodFormData {
  name: string;
  feeType: string;
  feePercentage: number | null;
  feeFixed: number | null;
}

async function checkIfPaymentMethodLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const userWithPlan = await prisma.user.findUnique({
    where: { id: user.id },
    select: { planType: true },
  });

  if (!userWithPlan) throw new Error("User not found");

  const limits = PLAN_LIMITS[userWithPlan.planType];
  if (limits.maxPaymentMethods === -1) return false;

  const count = await prisma.paymentMethod.count({
    where: { userId: user.id },
  });

  return count >= limits.maxPaymentMethods;
}

export async function createPaymentMethod(data: PaymentMethodFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const limitReached = await checkIfPaymentMethodLimitReached();
  if (limitReached) {
    throw new Error("You have reached the maximum number of payment methods for your plan. Please upgrade to add more.");
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

export async function updatePaymentMethod(id: string, data: PaymentMethodFormData) {
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
