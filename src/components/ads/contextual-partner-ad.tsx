import { getRandomPartnerByCategory, getPartnerByExpenseType, getTopExpenseCategory } from '@/app/actions/partners';
import { PartnerAdBanner } from './partner-ad-banner';
import type { PartnerCategory } from '@prisma/client';

interface ContextualPartnerAdProps {
  context: 'expense-type' | 'top-expense' | 'fixed';
  expenseType?: string;
  category?: PartnerCategory;
  fallbackCategory?: PartnerCategory;
  location: string;
}

export async function ContextualPartnerAd({
  context,
  expenseType,
  category,
  fallbackCategory,
  location,
}: ContextualPartnerAdProps) {
  let partner = null;

  switch (context) {
    case 'expense-type':
      if (expenseType) {
        partner = await getPartnerByExpenseType(expenseType);
      }
      break;

    case 'top-expense':
      const topCategory = await getTopExpenseCategory();
      if (topCategory) {
        partner = await getRandomPartnerByCategory(topCategory);
      }
      break;

    case 'fixed':
      if (category) {
        partner = await getRandomPartnerByCategory(category);
      }
      break;
  }

  if (!partner && fallbackCategory) {
    partner = await getRandomPartnerByCategory(fallbackCategory);
  }

  if (!partner) return null;

  return <PartnerAdBanner category={partner.category} location={location} />;
}
