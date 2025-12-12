import { BudgetAlertAd } from '@/components/ads/budget-alert-ad';
import type { Budget, ExpenseType } from '@prisma/client';

interface BudgetCardWithAdProps {
  budget: Budget & { expenseType: ExpenseType };
  currentAmount: number;
  showAds: boolean;
  children: React.ReactNode;
}

export async function BudgetCardWithAd({
  budget,
  currentAmount,
  showAds,
  children,
}: BudgetCardWithAdProps) {
  return (
    <div className="space-y-4">
      {children}
      {showAds && (
        <BudgetAlertAd budget={budget} currentAmount={currentAmount} />
      )}
    </div>
  );
}
