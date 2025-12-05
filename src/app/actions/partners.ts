'use server';

import { getCurrentSession } from '@/lib/server/auth/session';
import { prisma } from '@/lib/server/db';
import { getUserSubscriptionPlan } from '@/lib/server/payment';
import type { Partner, PartnerCategory, PlanType } from '@prisma/client';

export async function getPartnersForUser(): Promise<Partner[]> {
  const { user } = await getCurrentSession();
  if (!user) return [];

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return await prisma.partner.findMany({
    where: {
      active: true,
      showForPlans: {
        has: subscriptionPlan.name as PlanType,
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getPartnersByCategory(
  category: PartnerCategory
): Promise<Partner[]> {
  const { user } = await getCurrentSession();
  if (!user) return [];

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return await prisma.partner.findMany({
    where: {
      active: true,
      category,
      showForPlans: {
        has: subscriptionPlan.name as PlanType,
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getRandomPartnerByCategory(
  category: PartnerCategory
): Promise<Partner | null> {
  const partners = await getPartnersByCategory(category);

  if (partners.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * partners.length);
  return partners[randomIndex];
}
