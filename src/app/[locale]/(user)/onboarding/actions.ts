'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getPostOnboardingCookies, clearPostOnboardingCookies } from "@/lib/checkout-cookies";
import { createCheckoutSession } from "@/app/[locale]/(public)/pricing/actions";
import type { AccessibilitySettings } from "@/types/accessibility";
import { getUserSubscriptionPlan } from "@/lib/server/payment";
import { PLAN_LIMITS } from "@/config/subscription";

export interface OnboardingData {
  platforms: Array<{ name: string; }>;
  drivers: Array<{ name: string; isSelf?: boolean }>;
  vehicles: Array<{ name: string; plate?: string; model?: string; year?: number; isPrimary?: boolean }>;
  expenseTypes: Array<{ name: string }>;
  paymentMethods: Array<{ name: string }>;
  preferences?: {
    language?: string;
    currency?: string;
    timezone?: string;
  };
  accessibility?: AccessibilitySettings;
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
          userId: user.id,
        })),
      });
    }

    let createdDriverIds: string[] = [];
    if (data.drivers && data.drivers.length > 0) {
      const subscriptionPlan = await getUserSubscriptionPlan(user.id);
      const currentDriverCount = await tx.driver.count({ where: { userId: user.id } });

      const planLimits = PLAN_LIMITS[subscriptionPlan.isPro ? "PRO" : subscriptionPlan.name === "Simple" ? "SIMPLE" : "FREE"];
      const maxDrivers = planLimits.maxDrivers;

      if (maxDrivers !== -1 && currentDriverCount + data.drivers.length > maxDrivers) {
        throw new Error(`Você atingiu o limite de ${maxDrivers} motorista(s) do seu plano. Faça upgrade para adicionar mais.`);
      }

      const drivers = await Promise.all(
        data.drivers.map((driver) =>
          tx.driver.create({
            data: {
              name: driver.name,
              isSelf: driver.isSelf || false,
              userId: user.id,
            },
          })
        )
      );
      createdDriverIds = drivers.map(d => d.id);
    }

    let createdVehicleIds: string[] = [];
    if (data.vehicles && data.vehicles.length > 0) {
      const subscriptionPlan = await getUserSubscriptionPlan(user.id);
      const currentVehicleCount = await tx.vehicle.count({ where: { userId: user.id } });

      const planLimits = PLAN_LIMITS[subscriptionPlan.isPro ? "PRO" : subscriptionPlan.name === "Simple" ? "SIMPLE" : "FREE"];
      const maxVehicles = planLimits.maxVehicles;

      if (maxVehicles !== -1 && currentVehicleCount + data.vehicles.length > maxVehicles) {
        throw new Error(`Você atingiu o limite de ${maxVehicles} veículo(s) do seu plano. Faça upgrade para adicionar mais.`);
      }

      const vehicles = await Promise.all(
        data.vehicles.map((vehicle) =>
          tx.vehicle.create({
            data: {
              name: vehicle.name,
              plate: vehicle.plate?.toUpperCase() || null,
              model: vehicle.model || null,
              year: vehicle.year || null,
              isPrimary: vehicle.isPrimary || false,
              userId: user.id,
            },
          })
        )
      );
      createdVehicleIds = vehicles.map(v => v.id);
    }

    if (data.expenseTypes && data.expenseTypes.length > 0) {
      await tx.expenseType.createMany({
        data: data.expenseTypes.map((type) => ({
          name: type.name,
          userId: user.id,
        })),
      });
    }

    if (data.paymentMethods && data.paymentMethods.length > 0) {
      await tx.paymentMethod.createMany({
        data: data.paymentMethods.map((method) => ({
          name: method.name,
          userId: user.id,
        })),
      });
    }

    const defaultDriverId = createdDriverIds.length === 1 && data.drivers?.[0]?.isSelf
      ? createdDriverIds[0]
      : createdDriverIds.length > 1
        ? data.drivers?.find(d => d.isSelf)
          ? createdDriverIds[data.drivers.findIndex(d => d.isSelf)]
          : null
        : null;

    const defaultVehicleId = createdVehicleIds.length === 1 && data.vehicles?.[0]?.isPrimary
      ? createdVehicleIds[0]
      : createdVehicleIds.length > 1
        ? data.vehicles?.find(v => v.isPrimary)
          ? createdVehicleIds[data.vehicles.findIndex(v => v.isPrimary)]
          : null
        : null;

    if (data.preferences || data.accessibility) {
      await tx.userPreferences.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          language: data.preferences?.language || 'pt',
          currency: data.preferences?.currency || 'brl',
          timezone: data.preferences?.timezone || 'America/Sao_Paulo',
          defaultDriverId,
          defaultVehicleId,
          theme: data.accessibility?.theme || 'system',
          fontSize: data.accessibility?.fontSize || 'medium',
          fontFamily: data.accessibility?.fontFamily || 'default',
          lineSpacing: data.accessibility?.lineSpacing || 'normal',
          reducedMotion: data.accessibility?.reducedMotion || false,
          highContrast: data.accessibility?.highContrast || false,
          keyboardShortcuts: data.accessibility?.keyboardShortcuts ? JSON.parse(JSON.stringify(data.accessibility.keyboardShortcuts)) : undefined,
        },
        update: {
          language: data.preferences?.language,
          currency: data.preferences?.currency,
          timezone: data.preferences?.timezone,
          defaultDriverId,
          defaultVehicleId,
          ...(data.accessibility && {
            theme: data.accessibility.theme,
            fontSize: data.accessibility.fontSize,
            fontFamily: data.accessibility.fontFamily,
            lineSpacing: data.accessibility.lineSpacing,
            reducedMotion: data.accessibility.reducedMotion,
            highContrast: data.accessibility.highContrast,
            keyboardShortcuts: data.accessibility.keyboardShortcuts ? JSON.parse(JSON.stringify(data.accessibility.keyboardShortcuts)) : undefined,
          }),
        },
      });
    }

    await tx.user.update({
      where: { id: user.id },
      data: { hasCompletedOnboarding: true },
    });
  });

  const cookieStore = await cookies();
  const checkoutCookies = await getPostOnboardingCookies(cookieStore);

  let redirectUrl = "/dashboard";

  if (checkoutCookies.plan && (checkoutCookies.plan === 'simple' || checkoutCookies.plan === 'pro')) {
    const interval = checkoutCookies.interval || 'monthly';
    const checkoutResult = await createCheckoutSession(checkoutCookies.plan, interval as 'monthly' | 'yearly');

    if (checkoutResult.url) {
      redirectUrl = checkoutResult.url;
    } else {
      redirectUrl = "/dashboard";
    }
  }

  await clearPostOnboardingCookies(cookieStore);
  revalidatePath("/dashboard");

  return { success: true, redirectUrl };
}
