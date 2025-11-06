'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Target,
  Users,
  Car,
  Building2,
  User,
  Settings,
  Sliders,
  CreditCard,
  HelpCircle,
  Plus,
  FileText,
  Tag,
  Wallet,
} from 'lucide-react';
import { useScopedI18n } from '@/locales/client';

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();
  const t = useScopedI18n('ui.commandMenu');

  const runCommand = React.useCallback((callback: () => void) => {
    onOpenChange(false);
    callback();
  }, [onOpenChange]);

  const pages = [
    {
      icon: LayoutDashboard,
      label: t('dashboard'),
      action: () => router.push('/dashboard'),
    },
    {
      icon: TrendingDown,
      label: t('expenses'),
      action: () => router.push('/dashboard/expenses'),
    },
    {
      icon: TrendingUp,
      label: t('revenues'),
      action: () => router.push('/dashboard/revenues'),
    },
    {
      icon: PiggyBank,
      label: t('budgets'),
      action: () => router.push('/budgets'),
    },
    {
      icon: Target,
      label: t('goals'),
      action: () => router.push('/goals'),
    },
    {
      icon: FileText,
      label: t('reports'),
      action: () => router.push('/dashboard/reports'),
    },
    {
      icon: Users,
      label: t('drivers'),
      action: () => router.push('/dashboard/drivers'),
    },
    {
      icon: Car,
      label: t('vehicles'),
      action: () => router.push('/dashboard/vehicles'),
    },
    {
      icon: Building2,
      label: t('platforms'),
      action: () => router.push('/dashboard/platforms'),
    },
    {
      icon: Tag,
      label: t('expenseTypes'),
      action: () => router.push('/dashboard/expense-types'),
    },
    {
      icon: Wallet,
      label: t('paymentMethods'),
      action: () => router.push('/dashboard/payment-methods'),
    },
    {
      icon: User,
      label: t('account'),
      action: () => router.push('/account'),
    },
    {
      icon: Settings,
      label: t('settings'),
      action: () => router.push('/settings'),
    },
    {
      icon: Sliders,
      label: t('preferences'),
      action: () => router.push('/preferences'),
    },
    {
      icon: CreditCard,
      label: t('billing'),
      action: () => router.push('/billing'),
    },
    {
      icon: HelpCircle,
      label: t('help'),
      action: () => router.push('/help'),
    },
  ];

  const actions = [
    {
      icon: Plus,
      label: t('newExpense'),
      action: () => router.push('/dashboard/expenses/new'),
    },
    {
      icon: Plus,
      label: t('newRevenue'),
      action: () => router.push('/dashboard/revenues/new'),
    },
    {
      icon: Plus,
      label: t('newBudget'),
      action: () => router.push('/budgets/new'),
    },
    {
      icon: Plus,
      label: t('newGoal'),
      action: () => router.push('/goals/new'),
    },
    {
      icon: Plus,
      label: t('newDriver'),
      action: () => router.push('/dashboard/drivers/new'),
    },
    {
      icon: Plus,
      label: t('newVehicle'),
      action: () => router.push('/dashboard/vehicles/new'),
    },
    {
      icon: Plus,
      label: t('newPlatform'),
      action: () => router.push('/dashboard/platforms/new'),
    },
    {
      icon: Plus,
      label: t('newExpenseType'),
      action: () => router.push('/dashboard/expense-types/new'),
    },
    {
      icon: Plus,
      label: t('newPaymentMethod'),
      action: () => router.push('/dashboard/payment-methods/new'),
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t('placeholder')} />
      <CommandList>
        <CommandEmpty>{t('noResults')}</CommandEmpty>
        <CommandGroup heading={t('pages')}>
          {pages.map((page) => (
            <CommandItem
              key={page.label}
              onSelect={() => runCommand(page.action)}
            >
              <page.icon className="mr-2 h-4 w-4" />
              <span>{page.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t('actions')}>
          {actions.map((action) => (
            <CommandItem
              key={action.label}
              onSelect={() => runCommand(action.action)}
            >
              <action.icon className="mr-2 h-4 w-4" />
              <span>{action.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
