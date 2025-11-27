"use client";

import { useTransition, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldLabel, FieldSet, FieldGroup } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useScopedI18n } from "@/locales/client";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import type { DailyEntryConfig } from "@/app/[locale]/(financial)/dashboard/daily-entry/queries";
import { createDailyEntry } from "@/app/[locale]/(financial)/dashboard/daily-entry/actions";
import { RevenueSection } from "./revenue-section";
import { ExpenseSection } from "./expense-section";
import type { DailyEntryInput } from "@/types/daily-entry";

interface DailyEntryDialogProps {
  mode: "create";
  config: DailyEntryConfig;
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

export function DailyEntryDialog({ mode, config }: DailyEntryDialogProps) {
  const router = useRouter();
  const t = useScopedI18n("financial.dailyEntry");
  const tCommon = useScopedI18n("common");
  const [isPending, startTransition] = useTransition();

  const [revenueMode, setRevenueMode] = useState<"sum" | "individual" | "none">("none");
  const [expenseMode, setExpenseMode] = useState<"sum" | "individual" | "none">("none");

  const form = useForm({
    defaultValues: {
      date: new Date(),
      totalRevenue: undefined as number | undefined,
      selectedPlatforms: [] as string[],
      revenues: [] as IndividualRevenue[],
      paymentMethodId: undefined as string | undefined,
      revenueDriverId: undefined as string | undefined,
      revenueVehicleId: undefined as string | undefined,
      totalExpense: undefined as number | undefined,
      selectedExpenseTypes: [] as string[],
      expenses: [] as IndividualExpense[],
      expenseDriverId: undefined as string | undefined,
      expenseVehicleId: undefined as string | undefined,
      kmDriven: undefined as number | undefined,
      hoursWorked: undefined as number | undefined,
    },
    onSubmit: async ({ value }) => {
      const input: DailyEntryInput = {
        date: value.date,
        revenueMode: revenueMode,
        totalRevenue: value.totalRevenue,
        platformIds: value.selectedPlatforms,
        revenues: value.revenues,
        paymentMethodId: value.paymentMethodId,
        expenseMode: expenseMode,
        totalExpense: value.totalExpense,
        expenseTypeIds: value.selectedExpenseTypes,
        expenses: value.expenses,
        kmDriven: value.kmDriven,
        hoursWorked: value.hoursWorked,
        driverId: value.revenueDriverId || value.expenseDriverId,
        vehicleId: value.revenueVehicleId || value.expenseVehicleId,
      };

      startTransition(async () => {
        try {
          const result = await createDailyEntry(input);

          if (result.success) {
            let message = t("created");
            if (revenueMode === "sum" && value.totalRevenue) {
              message = t("createdSumRevenue", {
                amount: `R$ ${value.totalRevenue.toFixed(2)}`,
                count: value.selectedPlatforms.length.toString(),
              });
            } else if (revenueMode === "individual" && value.revenues.length > 0) {
              message = t("createdIndividualRevenue", {
                count: value.revenues.length.toString(),
              });
            }

            toast.success(message);
            handleClose();
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : tCommon("error");
          toast.error(errorMessage);
        }
      });
    },
  });

  function handleClose() {
    router.back();
  }

  const defaults = config.defaults;
  const isFree = config.planType === "FREE";

  const freeDriver = isFree && "driver" in defaults ? defaults.driver : null;
  const freeVehicle = isFree && "vehicle" in defaults ? defaults.vehicle : null;

  const smartDefaults = !isFree && "drivers" in defaults ? defaults : null;

  const canSubmit = useMemo(() => {
    const v = form.state.values;
    return (
      (revenueMode !== "none" &&
        ((revenueMode === "sum" && v.totalRevenue && v.totalRevenue > 0 && v.selectedPlatforms.length > 0) ||
          (revenueMode === "individual" && v.revenues.length > 0 && v.revenues.every(r => r.amount > 0 && r.platformId)))) ||
      (expenseMode !== "none" &&
        ((expenseMode === "sum" && v.totalExpense && v.totalExpense > 0 && v.selectedExpenseTypes.length > 0) ||
          (expenseMode === "individual" && v.expenses.length > 0 && v.expenses.every(e => e.amount > 0 && e.expenseTypeId))))
    );
  }, [form.state.values, revenueMode, expenseMode]);

  const isOpen = true;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("new")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
          <FieldSet>
            <FieldGroup>
              <form.Field name="date">
                {(field) => (
                  <Field>
                    <FieldLabel>{t("selectDate")}</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(field.state.value, "PPP", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.state.value}
                          onSelect={(date) => date && field.handleChange(date)}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                )}
              </form.Field>

              <RevenueSection
                platforms={isFree && "platforms" in defaults ? defaults.platforms : smartDefaults?.platforms || []}
                paymentMethods={smartDefaults?.paymentMethods || []}
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
                mostUsedPlatforms={smartDefaults?.mostUsedPlatforms || []}
                mode={revenueMode}
                onModeChange={setRevenueMode}
                totalRevenue={form.state.values.totalRevenue}
                onTotalRevenueChange={(val) => form.setFieldValue('totalRevenue', val)}
                selectedPlatforms={form.state.values.selectedPlatforms}
                onSelectedPlatformsChange={(val) => form.setFieldValue('selectedPlatforms', val)}
                revenues={form.state.values.revenues}
                onRevenuesChange={(val) => form.setFieldValue('revenues', val)}
                paymentMethodId={form.state.values.paymentMethodId}
                onPaymentMethodChange={(val) => form.setFieldValue('paymentMethodId', val)}
                driverId={form.state.values.revenueDriverId}
                onDriverChange={(val) => form.setFieldValue('revenueDriverId', val)}
                vehicleId={form.state.values.revenueVehicleId}
                onVehicleChange={(val) => form.setFieldValue('revenueVehicleId', val)}
              />

              <ExpenseSection
                expenseTypes={isFree && "expenseTypes" in defaults ? defaults.expenseTypes : smartDefaults?.expenseTypes || []}
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
                totalExpense={form.state.values.totalExpense}
                onTotalExpenseChange={(val) => form.setFieldValue('totalExpense', val)}
                selectedExpenseTypes={form.state.values.selectedExpenseTypes}
                onSelectedExpenseTypesChange={(val) => form.setFieldValue('selectedExpenseTypes', val)}
                expenses={form.state.values.expenses}
                onExpensesChange={(val) => form.setFieldValue('expenses', val)}
                driverId={form.state.values.expenseDriverId}
                onDriverChange={(val) => form.setFieldValue('expenseDriverId', val)}
                vehicleId={form.state.values.expenseVehicleId}
                onVehicleChange={(val) => form.setFieldValue('expenseVehicleId', val)}
              />

              {/* Metrics Section (Inlined) */}
              {(revenueMode !== "none" || expenseMode !== "none") && (
                <>
                  <form.Field name="kmDriven">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="kmDriven">{t("kmDriven")}</FieldLabel>
                        <Input
                          id="kmDriven"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          disabled={isPending}
                        />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="hoursWorked">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="hoursWorked">{t("hoursWorked")}</FieldLabel>
                        <Input
                          id="hoursWorked"
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="0.0"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          disabled={isPending}
                        />
                      </Field>
                    )}
                  </form.Field>
                </>
              )}

              {!canSubmit && (revenueMode !== "none" || expenseMode !== "none") && (
                <p className="text-sm text-muted-foreground">
                  {t("atLeastOneRequired")}
                </p>
              )}

              <Field orientation="horizontal">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                  {tCommon("cancel")}
                </Button>
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {isPending ? tCommon("saving") : tCommon("save")}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
