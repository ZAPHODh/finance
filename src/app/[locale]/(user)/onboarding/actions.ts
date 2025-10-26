'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";

export interface OnboardingData {
  platforms: Array<{ name: string; icon?: string }>;
  expenseTypes: Array<{ name: string; icon?: string }>;
  paymentMethods: Array<{ name: string; icon?: string }>;
  preferences?: {
    language?: string;
    currency?: string;
    timezone?: string;
  };
}

export async function completeOnboarding(data: OnboardingData) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (user.hasCompletedOnboarding) {
    throw new Error("Onboarding already completed");
  }

  await prisma.$transaction(async (tx) => {

    if (data.platforms && data.platforms.length > 0) {
      await tx.platform.createMany({
        data: data.platforms.map((platform) => ({
          name: platform.name,
          icon: platform.icon || null,
          userId: user.id,
        })),
      });
    }

    if (data.expenseTypes && data.expenseTypes.length > 0) {
      await tx.expenseType.createMany({
        data: data.expenseTypes.map((type) => ({
          name: type.name,
          icon: type.icon || null,
          userId: user.id,
        })),
      });
    }

    if (data.paymentMethods && data.paymentMethods.length > 0) {
      await tx.paymentMethod.createMany({
        data: data.paymentMethods.map((method) => ({
          name: method.name,
          icon: method.icon || null,
          userId: user.id,
        })),
      });
    }

    if (data.preferences) {
      await tx.userPreferences.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          language: data.preferences.language || 'pt',
          currency: data.preferences.currency || 'brl',
          timezone: data.preferences.timezone || 'America/Sao_Paulo',
        },
        update: {
          language: data.preferences.language,
          currency: data.preferences.currency,
          timezone: data.preferences.timezone,
        },
      });
    }

    await tx.user.update({
      where: { id: user.id },
      data: { hasCompletedOnboarding: true },
    });
  });

  revalidatePath("/dashboard");
}
