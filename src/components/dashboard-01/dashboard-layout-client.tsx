"use client";

import { useState, useEffect, useTransition } from "react";
import { DailyEntryDialog } from "@/components/financial/daily-entry-dialog";
import type { DailyEntryConfig } from "@/app/[locale]/(financial)/dashboard/daily-entry/queries";
import { QuickActionsWrapper } from "./quick-actions-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SiteHeader } from "./site-header";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useRouter } from "next/navigation";
import { getLastDailyEntry } from "@/app/[locale]/(financial)/dashboard/daily-entry/actions";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

export interface PrefillData {
  revenueAmount?: number;
  platformIds?: string[];
  revenueDriverId?: string;
  revenueVehicleId?: string;
  paymentMethodId?: string;
  kmDriven?: number;
  hoursWorked?: number;
  expenseAmount?: number;
  expenseTypeIds?: string[];
  expenseDriverId?: string;
  expenseVehicleId?: string;
}

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  dialogs: React.ReactNode;
  config: DailyEntryConfig;
  labels: {
    newDailyEntry: string;
    repeatLast: string;
    noLastEntry: string;
    loadingLastEntry: string;
  };
  dashboardTitle: string;
}

export function DashboardLayoutClient({
  children,
  dialogs,
  config,
  labels,
  dashboardTitle,
}: DashboardLayoutClientProps) {
  const router = useRouter();
  const t = useScopedI18n('financial.dailyEntry');
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDailyEntryOpen, setIsDailyEntryOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<PrefillData | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleOpenDialog() {
    setPrefillData(undefined);
    setIsDailyEntryOpen(true);
  }

  function handleOpenDialogWithPrefill(data: PrefillData) {
    setPrefillData(data);
    setIsDailyEntryOpen(true);
  }

  function handleCloseDialog() {
    setIsDailyEntryOpen(false);
    setPrefillData(undefined);
  }

  function handleRepeatLast() {
    startTransition(async () => {
      try {
        const lastEntry = await getLastDailyEntry();

        if (!lastEntry || (!lastEntry.revenue && !lastEntry.expense)) {
          toast.error(t('noLastEntry'));
          return;
        }

        const data: PrefillData = {};

        if (lastEntry.revenue) {
          data.revenueAmount = lastEntry.revenue.amount;
          data.platformIds = lastEntry.revenue.platformIds;
          if (lastEntry.revenue.driverId) data.revenueDriverId = lastEntry.revenue.driverId;
          if (lastEntry.revenue.vehicleId) data.revenueVehicleId = lastEntry.revenue.vehicleId;
          if (lastEntry.revenue.paymentMethodId) data.paymentMethodId = lastEntry.revenue.paymentMethodId;
          if (lastEntry.revenue.kmDriven) data.kmDriven = lastEntry.revenue.kmDriven;
          if (lastEntry.revenue.hoursWorked) data.hoursWorked = lastEntry.revenue.hoursWorked;
        }

        if (lastEntry.expense) {
          data.expenseAmount = lastEntry.expense.amount;
          if (lastEntry.expense.expenseTypeIds && lastEntry.expense.expenseTypeIds.length > 0) {
            data.expenseTypeIds = lastEntry.expense.expenseTypeIds;
          }
          if (lastEntry.expense.driverId) data.expenseDriverId = lastEntry.expense.driverId;
          if (lastEntry.expense.vehicleId) data.expenseVehicleId = lastEntry.expense.vehicleId;
        }

        handleOpenDialogWithPrefill(data);
      } catch (error) {
        toast.error(t('noLastEntry'));
      }
    });
  }

  useKeyboardShortcut(
    { key: "d", ctrl: true },
    handleOpenDialog,
    mounted
  );

  useKeyboardShortcut(
    { key: "r", ctrl: true },
    () => router.push("/dashboard/revenues/new"),
    mounted
  );

  useKeyboardShortcut(
    { key: "e", ctrl: true },
    () => router.push("/dashboard/expenses/new"),
    mounted
  );

  useKeyboardShortcut(
    { key: "d", ctrl: true, shift: true },
    handleRepeatLast,
    mounted && !isPending
  );

  return (
    <>
      <SiteHeader
        title={dashboardTitle}
        mobileActions={
          <QuickActionsWrapper
            labels={labels}
            onOpenDialog={handleOpenDialog}
            onOpenDialogWithPrefill={handleOpenDialogWithPrefill}
          />
        }
        actions={
          <Button size="sm" variant="default" onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-1" />
            {labels.newDailyEntry}
          </Button>
        }
      />
      {children}
      {dialogs}
      {isDailyEntryOpen && (
        <DailyEntryDialog
          mode="create"
          config={config}
          open={isDailyEntryOpen}
          onClose={handleCloseDialog}
          prefillData={prefillData}
        />
      )}
    </>
  );
}
