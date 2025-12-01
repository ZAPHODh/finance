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
import { useAccessibilitySettings } from "@/hooks/use-accessibility-settings";
import { useFontSettings } from "@/hooks/use-font-settings";
import { DEFAULT_KEYBOARD_SHORTCUTS } from "@/config/accessibility";

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

  const { settings, isLoading } = useAccessibilitySettings();
  const shortcuts = settings?.keyboardShortcuts || DEFAULT_KEYBOARD_SHORTCUTS;

  useFontSettings({
    fontSize: settings?.fontSize || "medium",
    fontFamily: settings?.fontFamily || "default",
    lineSpacing: settings?.lineSpacing || "normal",
  });

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
      } catch {
        toast.error(t('noLastEntry'));
      }
    });
  }

  useKeyboardShortcut(
    shortcuts.newDailyEntry,
    handleOpenDialog,
    mounted && !isLoading
  );

  useKeyboardShortcut(
    shortcuts.newRevenue,
    () => router.push("/dashboard/revenues/new"),
    mounted && !isLoading
  );

  useKeyboardShortcut(
    shortcuts.newExpense,
    () => router.push("/dashboard/expenses/new"),
    mounted && !isLoading
  );

  useKeyboardShortcut(
    shortcuts.repeatLast,
    handleRepeatLast,
    mounted && !isPending && !isLoading
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
