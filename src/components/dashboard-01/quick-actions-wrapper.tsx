'use client';

import { QuickActionsMenu } from "./quick-actions-menu";
import { getLastDailyEntry } from "@/app/[locale]/(financial)/dashboard/daily-entry/actions";
import { toast } from "sonner";

interface PrefillData {
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

interface QuickActionsWrapperProps {
  labels: {
    newDailyEntry: string;
    repeatLast: string;
    noLastEntry: string;
    loadingLastEntry: string;
  };
  onOpenDialog: () => void;
  onOpenDialogWithPrefill: (data: PrefillData) => void;
}

export function QuickActionsWrapper({ labels, onOpenDialog, onOpenDialogWithPrefill }: QuickActionsWrapperProps) {

  async function handleRepeatLast() {
    try {
      const lastEntry = await getLastDailyEntry();
      if (!lastEntry || (!lastEntry.revenue && !lastEntry.expense)) {
        toast.error(labels.noLastEntry);
        return;
      }

      const prefillData: PrefillData = {};

      if (lastEntry.revenue) {
        prefillData.revenueAmount = lastEntry.revenue.amount;
        prefillData.platformIds = lastEntry.revenue.platformIds;
        if (lastEntry.revenue.driverId) prefillData.revenueDriverId = lastEntry.revenue.driverId;
        if (lastEntry.revenue.vehicleId) prefillData.revenueVehicleId = lastEntry.revenue.vehicleId;
        if (lastEntry.revenue.paymentMethodId) prefillData.paymentMethodId = lastEntry.revenue.paymentMethodId;
        if (lastEntry.revenue.kmDriven) prefillData.kmDriven = lastEntry.revenue.kmDriven;
        if (lastEntry.revenue.hoursWorked) prefillData.hoursWorked = lastEntry.revenue.hoursWorked;
      }

      if (lastEntry.expense) {
        prefillData.expenseAmount = lastEntry.expense.amount;
        if (lastEntry.expense.expenseTypeIds && lastEntry.expense.expenseTypeIds.length > 0) {
          prefillData.expenseTypeIds = lastEntry.expense.expenseTypeIds;
        }
        if (lastEntry.expense.driverId) prefillData.expenseDriverId = lastEntry.expense.driverId;
        if (lastEntry.expense.vehicleId) prefillData.expenseVehicleId = lastEntry.expense.vehicleId;
      }

      onOpenDialogWithPrefill(prefillData);
    } catch {
      toast.error(labels.noLastEntry);
    }

  }

  return (
    <QuickActionsMenu
      labels={labels}
      onNewDailyEntry={onOpenDialog}
      onRepeatLast={handleRepeatLast}
    />
  );
}
