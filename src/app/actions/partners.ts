'use server';

import { getCurrentSession } from '@/lib/server/auth/session';
import { prisma } from '@/lib/server/db';
import { getUserSubscriptionPlan } from '@/lib/server/payment';
import { getCurrentLocale } from '@/locales/server';
import { matchExpenseTypeToCategory } from '@/lib/ads/ad-config';
import type { Partner, PartnerCategory, PlanType } from '@prisma/client';

async function getPartnersBase(additionalWhere = {}) {
  const { user } = await getCurrentSession();
  if (!user) return [];

  const [subscriptionPlan, locale] = await Promise.all([
    getUserSubscriptionPlan(user.id),
    getCurrentLocale(),
  ]);

  return await prisma.partner.findMany({
    where: {
      active: true,
      showForPlans: { has: subscriptionPlan.name.toUpperCase() as PlanType },
      locales: { has: locale },
      ...additionalWhere,
    },
    orderBy: [
      { priority: 'desc' },
      { name: 'asc' },
    ],
  });
}

export async function getPartnersForUser(): Promise<Partner[]> {
  return getPartnersBase();
}

export async function getPartnersByCategory(
  category: PartnerCategory
): Promise<Partner[]> {
  return getPartnersBase({ category });
}

export async function getRandomPartnerByCategory(
  category: PartnerCategory
): Promise<Partner | null> {
  const partners = await getPartnersByCategory(category);
  if (partners.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * partners.length);
  return partners[randomIndex];
}

export async function getPartnerByExpenseType(
  expenseTypeName: string
): Promise<Partner | null> {
  const category = matchExpenseTypeToCategory(expenseTypeName);
  if (!category) return null;

  return getRandomPartnerByCategory(category);
}

export async function getTopExpenseCategory(): Promise<PartnerCategory | null> {
  const { user } = await getCurrentSession();
  if (!user) return null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const expenseTypes = await prisma.expenseType.findMany({
    where: {
      userId: user.id,
      expenses: {
        some: {
          expense: {
            date: { gte: startOfMonth },
            driver: {
              userId: user.id,
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      expenses: {
        where: {
          expense: {
            date: { gte: startOfMonth },
            driver: {
              userId: user.id,
            },
          },
        },
        select: {
          expense: {
            select: {
              amount: true,
            },
          },
        },
      },
    },
  });

  if (expenseTypes.length === 0) return null;

  const expenseTypesWithTotals = expenseTypes.map((type) => ({
    name: type.name,
    total: type.expenses.reduce((sum, e) => sum + e.expense.amount, 0),
  }));

  const topExpenseType = expenseTypesWithTotals.sort((a, b) => b.total - a.total)[0];

  return matchExpenseTypeToCategory(topExpenseType.name);
}
