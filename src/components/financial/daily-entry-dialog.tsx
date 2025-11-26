"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, usePathname } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useScopedI18n } from "@/locales/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getDailyEntryConfig } from "@/app/[locale]/(financial)/dashboard/daily-entry/queries";
import { createDailyEntry } from "@/app/[locale]/(financial)/dashboard/daily-entry/actions";
import { RevenueSection } from "./revenue-section";
import { ExpenseSection } from "./expense-section";
import { MetricsSection } from "./metrics-section";
import type { DailyEntryInput } from "@/types/daily-entry";

interface DailyEntryDialogProps {
  mode: "create";
}

interface IndividualRevenue {
  id: string;
  amount: number;
  platformId: string;
}

interface IndividualExpense {
  id: string;
  amount: number;
  expenseTypeId: string;
}

export function DailyEntryDialog({ mode }: DailyEntryDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n("financial.dailyEntry");
  const tCommon = useScopedI18n("common");
  const [isPending, startTransition] = useTransition();

  // Fetch configuration
  const { data: config, isLoading } = useQuery({
    queryKey: ["daily-entry-config"],
    queryFn: () => getDailyEntryConfig(),
  });

  // Form state
  const [date, setDate] = useState<Date>(new Date());

  // Revenue state
  const [revenueMode, setRevenueMode] = useState<"sum" | "individual" | "none">("none");
  const [totalRevenue, setTotalRevenue] = useState<number | undefined>();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [revenues, setRevenues] = useState<IndividualRevenue[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState<string | undefined>();
  const [revenueDriverId, setRevenueDriverId] = useState<string | undefined>();
  const [revenueVehicleId, setRevenueVehicleId] = useState<string | undefined>();

  // Expense state
  const [expenseMode, setExpenseMode] = useState<"sum" | "individual" | "none">("none");
  const [totalExpense, setTotalExpense] = useState<number | undefined>();
  const [selectedExpenseTypes, setSelectedExpenseTypes] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<IndividualExpense[]>([]);
  const [expenseDriverId, setExpenseDriverId] = useState<string | undefined>();
  const [expenseVehicleId, setExpenseVehicleId] = useState<string | undefined>();

  // Metrics state
  const [kmDriven, setKmDriven] = useState<number | undefined>();
  const [hoursWorked, setHoursWorked] = useState<number | undefined>();

  function handleClose() {
    router.push(pathname);
  }

  function handleSubmit() {
    if (!config) return;

    // Build input
    const input: DailyEntryInput = {
      date,
      revenueMode,
      totalRevenue,
      platformIds: selectedPlatforms,
      revenues,
      paymentMethodId,
      expenseMode,
      totalExpense,
      expenseTypeIds: selectedExpenseTypes,
      expenses,
      kmDriven,
      hoursWorked,
      driverId: revenueDriverId || expenseDriverId,
      vehicleId: revenueVehicleId || expenseVehicleId,
    };

    startTransition(async () => {
      try {
        const result = await createDailyEntry(input);

        if (result.success) {
          // Build success message
          let message = t("created");
          if (revenueMode === "sum" && totalRevenue) {
            message = t("createdSumRevenue", {
              amount: `R$ ${totalRevenue.toFixed(2)}`,
              count: selectedPlatforms.length.toString(),
            });
          } else if (revenueMode === "individual" && revenues.length > 0) {
            message = t("createdIndividualRevenue", {
              count: revenues.length.toString(),
            });
          }

          toast.success(message);
          handleClose();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create daily entry";
        toast.error(errorMessage);
      }
    });
  }

  const isOpen = true; // Always open when mounted

  if (isLoading || !config) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("new")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const defaults = config.defaults;
  const isFree = config.planType === "FREE";

  // For FREE plan, get driver/vehicle
  const freeDriver = isFree && "driver" in defaults ? defaults.driver : null;
  const freeVehicle = isFree && "vehicle" in defaults ? defaults.vehicle : null;

  // For SIMPLE/PRO plan, get defaults
  const smartDefaults = !isFree && "drivers" in defaults ? defaults : null;

  const canSubmit =
    (revenueMode !== "none" &&
      ((revenueMode === "sum" && totalRevenue && totalRevenue > 0 && selectedPlatforms.length > 0) ||
        (revenueMode === "individual" && revenues.length > 0 && revenues.every(r => r.amount > 0)))) ||
    (expenseMode !== "none" &&
      ((expenseMode === "sum" && totalExpense && totalExpense > 0 && selectedExpenseTypes.length > 0) ||
        (expenseMode === "individual" && expenses.length > 0 && expenses.every(e => e.amount > 0))));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("new")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Picker */}
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("selectDate")}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Revenue Section */}
          <RevenueSection
            platforms={isFree && "platforms" in defaults ? defaults.platforms : smartDefaults?.platforms || []}
            paymentMethods={smartDefaults?.paymentMethods}
            drivers={smartDefaults?.drivers}
            vehicles={smartDefaults?.vehicles}
            planType={config.planType}
            canSelectDriver={config.features.canSelectDriver}
            canSelectVehicle={config.features.canSelectVehicle}
            canSelectPaymentMethod={config.features.canSelectPaymentMethod}
            defaultDriver={freeDriver}
            defaultVehicle={freeVehicle}
            defaultDriverId={smartDefaults?.defaultDriverId}
            defaultVehicleId={smartDefaults?.defaultVehicleId}
            mostUsedPlatforms={smartDefaults?.mostUsedPlatforms}
            mode={revenueMode}
            onModeChange={setRevenueMode}
            totalRevenue={totalRevenue}
            onTotalRevenueChange={setTotalRevenue}
            selectedPlatforms={selectedPlatforms}
            onSelectedPlatformsChange={setSelectedPlatforms}
            revenues={revenues}
            onRevenuesChange={setRevenues}
            paymentMethodId={paymentMethodId}
            onPaymentMethodChange={setPaymentMethodId}
            driverId={revenueDriverId}
            onDriverChange={setRevenueDriverId}
            vehicleId={revenueVehicleId}
            onVehicleChange={setRevenueVehicleId}
          />

          {/* Expense Section */}
          <ExpenseSection
            expenseTypes={smartDefaults?.expenseTypes || []}
            drivers={smartDefaults?.drivers}
            vehicles={smartDefaults?.vehicles}
            planType={config.planType}
            canSelectDriver={config.features.canSelectDriver}
            canSelectVehicle={config.features.canSelectVehicle}
            defaultDriver={freeDriver}
            defaultVehicle={freeVehicle}
            defaultDriverId={smartDefaults?.defaultDriverId}
            defaultVehicleId={smartDefaults?.defaultVehicleId}
            mode={expenseMode}
            onModeChange={setExpenseMode}
            totalExpense={totalExpense}
            onTotalExpenseChange={setTotalExpense}
            selectedExpenseTypes={selectedExpenseTypes}
            onSelectedExpenseTypesChange={setSelectedExpenseTypes}
            expenses={expenses}
            onExpensesChange={setExpenses}
            driverId={expenseDriverId}
            onDriverChange={setExpenseDriverId}
            vehicleId={expenseVehicleId}
            onVehicleChange={setExpenseVehicleId}
          />

          {/* Metrics Section */}
          {(revenueMode !== "none" || expenseMode !== "none") && (
            <MetricsSection
              kmDriven={kmDriven}
              hoursWorked={hoursWorked}
              onKmChange={setKmDriven}
              onHoursChange={setHoursWorked}
              disabled={isPending}
            />
          )}

          {/* Validation message */}
          {!canSubmit && (revenueMode !== "none" || expenseMode !== "none") && (
            <p className="text-sm text-muted-foreground">
              {t("atLeastOneRequired")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
            {isPending ? tCommon("saving") : tCommon("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
