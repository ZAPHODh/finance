import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { getI18n } from '@/locales/server';
import { getPartnerByExpenseType } from '@/app/actions/partners';
import { TrackableAdWrapper } from './trackable-ad-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { Budget, ExpenseType } from '@prisma/client';

interface BudgetAlertAdProps {
  budget: Budget & { expenseType: ExpenseType };
  currentAmount: number;
}

export async function BudgetAlertAd({ budget, currentAmount }: BudgetAlertAdProps) {
  const threshold = budget.alertThreshold;
  const percentUsed = currentAmount / budget.monthlyLimit;

  if (percentUsed < threshold) return null;

  const t = await getI18n();
  const partner = await getPartnerByExpenseType(budget.expenseType.name);

  if (!partner) return null;

  return (
    <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/10">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-900 dark:text-orange-100">
        {t('dashboard.ads.budgetAlert.nearLimit', { category: budget.expenseType.name })}
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm text-muted-foreground">
          {t('dashboard.ads.budgetAlert.helpReduce', { category: budget.expenseType.name })}
        </p>

        <TrackableAdWrapper
          partnerId={partner.id}
          partnerName={partner.name}
          category={partner.category}
          location={`budget_alert_${budget.expenseType.name}`}
          ctaUrl={partner.ctaUrl}
        >
          <div className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              {partner.logoUrl && (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-10 w-10 rounded object-contain"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{partner.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {t('dashboard.ads.sponsored')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{partner.tagline}</p>
                {partner.discountRate && (
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    {t('dashboard.ads.savingsUpTo', { discount: partner.discountRate })}
                  </p>
                )}
              </div>
            </div>
            <Button variant="default" size="sm" className="gap-2">
              {partner.ctaText}
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </TrackableAdWrapper>
      </AlertDescription>
    </Alert>
  );
}
