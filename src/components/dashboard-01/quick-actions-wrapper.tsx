'use client';

import { QuickActionsMenu } from "./quick-actions-menu";
import { useRouter } from "next/navigation";
import { getLastDailyEntry } from "@/app/[locale]/(financial)/dashboard/daily-entry/actions";
import { useTransition } from "react";
import { toast } from "sonner";

interface QuickActionsWrapperProps {
  labels: {
    newDailyEntry: string;
    repeatLast: string;
    noLastEntry: string;
    loadingLastEntry: string;
  };
}

export function QuickActionsWrapper({ labels }: QuickActionsWrapperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRepeatLast() {
    startTransition(async () => {
      try {
        const lastEntry = await getLastDailyEntry();

        if (!lastEntry || (!lastEntry.revenue && !lastEntry.expense)) {
          toast.error(labels.noLastEntry);
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
          if (lastEntry.expense.expenseTypeIds && lastEntry.expense.expenseTypeIds.length > 0) {
            lastEntry.expense.expenseTypeIds.forEach(id => params.append('expenseTypeId', id));
          }
          if (lastEntry.expense.driverId) params.set('expenseDriverId', lastEntry.expense.driverId);
          if (lastEntry.expense.vehicleId) params.set('expenseVehicleId', lastEntry.expense.vehicleId);
        }

        router.push(`/dashboard/daily-entry/new?${params.toString()}`);
      } catch (error) {
        toast.error(labels.noLastEntry);
      }
    });
  }

  return (
    <QuickActionsMenu
      labels={labels}
      onRepeatLast={handleRepeatLast}
    />
  );
}
