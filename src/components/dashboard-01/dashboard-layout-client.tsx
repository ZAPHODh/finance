"use client";

import { useState } from "react";
import { DailyEntryDialog } from "@/components/financial/daily-entry-dialog";
import type { DailyEntryConfig } from "@/app/[locale]/(financial)/dashboard/daily-entry/queries";
import { QuickActionsWrapper } from "./quick-actions-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SiteHeader } from "./site-header";

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
  const [isDailyEntryOpen, setIsDailyEntryOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<PrefillData | undefined>(undefined);

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
