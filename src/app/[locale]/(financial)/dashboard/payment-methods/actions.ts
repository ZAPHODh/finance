'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface PaymentMethodFormData {
  name: string;
  icon?: string;
}

export async function createPaymentMethod(data: PaymentMethodFormData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.paymentMethod.create({
    data: {
      name: data.name,
      icon: data.icon,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/payment-methods");
  redirect("/dashboard/payment-methods");
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
      icon: data.icon,
    },
  });

  revalidatePath("/dashboard/payment-methods");
  redirect("/dashboard/payment-methods");
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

  revalidatePath("/dashboard/payment-methods");
}
