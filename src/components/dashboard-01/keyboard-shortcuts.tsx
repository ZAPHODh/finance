"use client";

import { useRouter } from "next/navigation";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useEffect, useState, useTransition } from "react";
import { getLastDailyEntry } from "@/app/[locale]/(financial)/dashboard/daily-entry/actions";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

export function KeyboardShortcuts() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useScopedI18n('financial.dailyEntry');

  useEffect(() => {
    setMounted(true);
  }, []);

  useKeyboardShortcut(
    { key: "d", ctrl: true },
    () => {
      router.push("/dashboard/daily-entry/new");
    },
    mounted
  );

  useKeyboardShortcut(
    { key: "r", ctrl: true },
    () => {
      router.push("/dashboard/revenues/new");
    },
    mounted
  );

  useKeyboardShortcut(
    { key: "e", ctrl: true },
    () => {
      router.push("/dashboard/expenses/new");
    },
    mounted
  );

  useKeyboardShortcut(
    { key: "d", ctrl: true, shift: true },
    () => {
      startTransition(async () => {
        try {
          const lastEntry = await getLastDailyEntry();

          if (!lastEntry || (!lastEntry.revenue && !lastEntry.expense)) {
            toast.error(t('noLastEntry'));
            return;
          }

          const params = new URLSearchParams();
          params.set('repeat', 'true');

          if (lastEntry.revenue) {
            params.set('revenueAmount', lastEntry.revenue.amount.toString());
            params.set('platformIds', lastEntry.revenue.platformIds.join(','));
            if (lastEntry.revenue.driverId) params.set('revenueDriverId', lastEntry.revenue.driverId);
            if (lastEntry.revenue.vehicleId) params.set('revenueVehicleId', lastEntry.revenue.vehicleId);
            if (lastEntry.revenue.paymentMethodId) params.set('paymentMethodId', lastEntry.revenue.paymentMethodId);
            if (lastEntry.revenue.kmDriven) params.set('kmDriven', lastEntry.revenue.kmDriven.toString());
            if (lastEntry.revenue.hoursWorked) params.set('hoursWorked', lastEntry.revenue.hoursWorked.toString());
          }

          if (lastEntry.expense) {
            params.set('expenseAmount', lastEntry.expense.amount.toString());
            if (lastEntry.expense.expenseTypeId) params.set('expenseTypeId', lastEntry.expense.expenseTypeId);
            if (lastEntry.expense.driverId) params.set('expenseDriverId', lastEntry.expense.driverId);
            if (lastEntry.expense.vehicleId) params.set('expenseVehicleId', lastEntry.expense.vehicleId);
          }

          router.push(`/dashboard/daily-entry/new?${params.toString()}`);
        } catch (error) {
          toast.error(t('noLastEntry'));
        }
      });
    },
    mounted && !isPending
  );

  return null;
}
