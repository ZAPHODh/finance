'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, usePathname } from "next/navigation";
import { useQueryStates, parseAsBoolean, parseAsFloat, parseAsString } from "nuqs";
import { useScopedI18n } from "@/locales/client";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { createQuickDailyEntry, createCompleteDailyEntry } from "@/app/[locale]/(financial)/dashboard/daily-entry/actions";
import { useTransition, useEffect } from "react";
import { useDailyEntryMode } from "./use-daily-entry-mode";
import { useDailyEntryFormData, useSmartDefaults } from "@/hooks/use-daily-entry-data";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface DailyEntryDialogProps {
  mode: "create";
}

interface FormDataOptions {
  platforms: Array<{ id: string; name: string }>;
  paymentMethods: Array<{ id: string; name: string }>;
  drivers: Array<{ id: string; name: string }>;
  vehicles: Array<{ id: string; name: string }>;
  expenseTypes: Array<{ id: string; name: string }>;
}

export function DailyEntryDialog({ mode }: DailyEntryDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [params] = useQueryStates({
    repeat: parseAsBoolean,
    revenueAmount: parseAsFloat,
    platformIds: parseAsString,
    revenueDriverId: parseAsString,
    revenueVehicleId: parseAsString,
    paymentMethodId: parseAsString,
    kmDriven: parseAsFloat,
    hoursWorked: parseAsFloat,
    expenseAmount: parseAsFloat,
    expenseTypeId: parseAsString,
    expenseDriverId: parseAsString,
    expenseVehicleId: parseAsString,
  });
  const t = useScopedI18n('financial.dailyEntry');
  const tCommon = useScopedI18n('common');
  const tEntities = useScopedI18n('entities');
  const tRevenues = useScopedI18n('financial.revenues');
  const tExpenses = useScopedI18n('financial.expenses');
  const [isPending, startTransition] = useTransition();
  const { mode: entryMode, toggleMode, isQuick, isComplete } = useDailyEntryMode("quick");
  const queryClient = useQueryClient();

  const { data: formData, isLoading: isLoadingFormData } = useDailyEntryFormData();
  const { data: smartDefaults, isLoading: isLoadingDefaults } = useSmartDefaults();
  const isLoading = isLoadingFormData || isLoadingDefaults;

  const isOpen = pathname.includes("/daily-entry");
  const isRepeat = params.repeat === true;

  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      revenueAmount: 0,
      revenuePlatformIds: [] as string[],
      revenuePaymentMethodId: "",
      revenueDriverId: "",
      revenueVehicleId: "",
      revenueKmDriven: undefined as number | undefined,
      revenueHoursWorked: undefined as number | undefined,
      expenseAmount: 0,
      expenseTypeId: "",
      expenseDriverId: "",
      expenseVehicleId: "",
      useSameDriver: false,
      useSameVehicle: false,
    },
    onSubmit: async ({ value }) => {
      const revenue = value.revenueAmount > 0 ? {
        amount: Number(value.revenueAmount),
        platformIds: value.revenuePlatformIds,
        ...(isComplete && {
          driverId: value.revenueDriverId && value.revenueDriverId !== "none" ? value.revenueDriverId : undefined,
          vehicleId: value.revenueVehicleId && value.revenueVehicleId !== "none" ? value.revenueVehicleId : undefined,
          paymentMethodId: value.revenuePaymentMethodId && value.revenuePaymentMethodId !== "none" ? value.revenuePaymentMethodId : undefined,
          kmDriven: value.revenueKmDriven ? Number(value.revenueKmDriven) : undefined,
          hoursWorked: value.revenueHoursWorked ? Number(value.revenueHoursWorked) : undefined,
        }),
      } : null;

      const expense = value.expenseAmount > 0 ? {
        amount: Number(value.expenseAmount),
        ...(isComplete && {
          expenseTypeId: value.expenseTypeId && value.expenseTypeId !== "none" ? value.expenseTypeId : undefined,
          driverId: value.expenseDriverId && value.expenseDriverId !== "none" ? value.expenseDriverId : undefined,
          vehicleId: value.expenseVehicleId && value.expenseVehicleId !== "none" ? value.expenseVehicleId : undefined,
          useSameDriver: value.useSameDriver,
          useSameVehicle: value.useSameVehicle,
        }),
      } : null;

      if (!revenue && !expense) {
        toast.error(t('atLeastOneRequired'));
        return;
      }

      const data = {
        date: new Date(value.date),
        revenue,
        expense,
      };

      startTransition(async () => {
        try {
          if (isQuick) {
            await createQuickDailyEntry(data);
          } else {
            await createCompleteDailyEntry(data);
          }
          queryClient.invalidateQueries({ queryKey: ['smart-defaults'] });
          toast.success(tCommon('createSuccess'));
          router.back();
        } catch (error) {
          toast.error(error instanceof Error ? error.message : tCommon('error'));
        }
      });
    },
  });

  useEffect(() => {
    if (isOpen && smartDefaults) {
      if (isRepeat) {
        if (params.revenueAmount) form.setFieldValue('revenueAmount', params.revenueAmount);
        if (params.platformIds) form.setFieldValue('revenuePlatformIds', params.platformIds.split(','));
        if (params.revenueDriverId) form.setFieldValue('revenueDriverId', params.revenueDriverId);
        if (params.revenueVehicleId) form.setFieldValue('revenueVehicleId', params.revenueVehicleId);
        if (params.paymentMethodId) form.setFieldValue('revenuePaymentMethodId', params.paymentMethodId);
        if (params.kmDriven) form.setFieldValue('revenueKmDriven', params.kmDriven);
        if (params.hoursWorked) form.setFieldValue('revenueHoursWorked', params.hoursWorked);
        if (params.expenseAmount) form.setFieldValue('expenseAmount', params.expenseAmount);
        if (params.expenseTypeId) form.setFieldValue('expenseTypeId', params.expenseTypeId);
        if (params.expenseDriverId) form.setFieldValue('expenseDriverId', params.expenseDriverId);
        if (params.expenseVehicleId) form.setFieldValue('expenseVehicleId', params.expenseVehicleId);

        toast.success(t('loadingLastEntry'));
      } else {
        if (smartDefaults.mostUsedPlatforms.length > 0) {
          form.setFieldValue('revenuePlatformIds', smartDefaults.mostUsedPlatforms);
        }
        if (smartDefaults.mostUsedPaymentMethod) {
          form.setFieldValue('revenuePaymentMethodId', smartDefaults.mostUsedPaymentMethod);
        }
        if (smartDefaults.mostUsedDriver) {
          form.setFieldValue('revenueDriverId', smartDefaults.mostUsedDriver);
        }
        if (smartDefaults.mostUsedVehicle) {
          form.setFieldValue('revenueVehicleId', smartDefaults.mostUsedVehicle);
        }
        if (smartDefaults.mostUsedExpenseType) {
          form.setFieldValue('expenseTypeId', smartDefaults.mostUsedExpenseType);
        }
      }
    }
  }, [isRepeat, isOpen, params, form, t, smartDefaults]);

  if (isLoading || !formData) {
    return (
      <Dialog open={isOpen} onOpenChange={() => router.back()}>
        <DialogContent className="max-w-xl p-4">
          <DialogHeader className="pb-2">
            <Skeleton className="h-6 w-48" />
          </DialogHeader>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2 mt-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2 mt-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => router.back()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-xl p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center justify-between">
            <span>{t('new')}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleMode}
              className="text-xs"
            >
              {isQuick ? (
                <>
                  {t('switchToComplete')} <ArrowRight className="ml-1 h-3 w-3" />
                </>
              ) : (
                <>
                  <ArrowLeft className="mr-1 h-3 w-3" /> {t('switchToQuick')}
                </>
              )}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldSet>
            <FieldGroup>
              <form.Field name="date">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="date">{tRevenues('date')}</FieldLabel>
                    <Input
                      id="date"
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                    />
                  </Field>
                )}
              </form.Field>

              <div className="text-sm font-semibold text-foreground/80 mb-1 mt-3">
                {t('revenueSection')}
              </div>

              <form.Field name="revenueAmount">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="revenueAmount">{t('totalRevenue')}</FieldLabel>
                    <Input
                      id="revenueAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      disabled={isPending}
                      placeholder="0.00"
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="revenuePlatformIds">
                {(field) => (
                  <Field>
                    <FieldLabel>{tRevenues('platforms')}</FieldLabel>
                    <div className="flex flex-wrap gap-3">
                      {formData.platforms.map((platform) => (
                        <label key={platform.id} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={field.state.value.includes(platform.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.handleChange([...field.state.value, platform.id]);
                              } else {
                                field.handleChange(field.state.value.filter((id) => id !== platform.id));
                              }
                            }}
                            disabled={isPending}
                          />
                          <span className="text-sm">{platform.name}</span>
                        </label>
                      ))}
                    </div>
                  </Field>
                )}
              </form.Field>

              {isComplete && (
                <>
                  <form.Field name="revenuePaymentMethodId">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="revenuePaymentMethodId">{tRevenues('paymentMethod')}</FieldLabel>
                        <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                          <SelectTrigger id="revenuePaymentMethodId">
                            <SelectValue placeholder={tRevenues('paymentMethod')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {formData.paymentMethods.map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                {method.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="revenueDriverId">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="revenueDriverId">{tEntities('driver')}</FieldLabel>
                        <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                          <SelectTrigger id="revenueDriverId">
                            <SelectValue placeholder={tEntities('selectDriver')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {formData.drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="revenueVehicleId">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="revenueVehicleId">{tEntities('vehicle')}</FieldLabel>
                        <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                          <SelectTrigger id="revenueVehicleId">
                            <SelectValue placeholder={tEntities('selectVehicle')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {formData.vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>

                  <div className="grid grid-cols-2 gap-4">
                    <form.Field name="revenueKmDriven">
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor="revenueKmDriven">{tRevenues('kmDriven')}</FieldLabel>
                          <Input
                            id="revenueKmDriven"
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                            disabled={isPending}
                            placeholder="0"
                          />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name="revenueHoursWorked">
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor="revenueHoursWorked">{tRevenues('hoursWorked')}</FieldLabel>
                          <Input
                            id="revenueHoursWorked"
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                            disabled={isPending}
                            placeholder="0"
                          />
                        </Field>
                      )}
                    </form.Field>
                  </div>
                </>
              )}

              <div className="text-sm font-semibold text-foreground/80 mb-1 mt-3">
                {t('expenseSection')}
              </div>

              <form.Field name="expenseAmount">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="expenseAmount">{t('totalExpense')}</FieldLabel>
                    <Input
                      id="expenseAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      disabled={isPending}
                      placeholder="0.00"
                    />
                  </Field>
                )}
              </form.Field>

              {isComplete && (
                <>
                  <form.Field name="expenseTypeId">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="expenseTypeId">{tExpenses('expenseType')}</FieldLabel>
                        <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                          <SelectTrigger id="expenseTypeId">
                            <SelectValue placeholder={tExpenses('expenseType')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {formData.expenseTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="useSameDriver">
                    {(field) => (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="useSameDriver"
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(!!checked)}
                          disabled={isPending}
                        />
                        <FieldLabel htmlFor="useSameDriver" className="cursor-pointer font-normal">
                          {t('useSameDriver')}
                        </FieldLabel>
                      </div>
                    )}
                  </form.Field>

                  <form.Subscribe selector={(state) => !state.values.useSameDriver}>
                    {(showDriverField) => showDriverField && (
                      <form.Field name="expenseDriverId">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="expenseDriverId">{tEntities('driver')}</FieldLabel>
                            <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                              <SelectTrigger id="expenseDriverId">
                                <SelectValue placeholder={tEntities('selectDriver')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-</SelectItem>
                                {formData.drivers.map((driver) => (
                                  <SelectItem key={driver.id} value={driver.id}>
                                    {driver.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      </form.Field>
                    )}
                  </form.Subscribe>

                  <form.Field name="useSameVehicle">
                    {(field) => (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="useSameVehicle"
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(!!checked)}
                          disabled={isPending}
                        />
                        <FieldLabel htmlFor="useSameVehicle" className="cursor-pointer font-normal">
                          {t('useSameVehicle')}
                        </FieldLabel>
                      </div>
                    )}
                  </form.Field>

                  <form.Subscribe selector={(state) => !state.values.useSameVehicle}>
                    {(showVehicleField) => showVehicleField && (
                      <form.Field name="expenseVehicleId">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="expenseVehicleId">{tEntities('vehicle')}</FieldLabel>
                            <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                              <SelectTrigger id="expenseVehicleId">
                                <SelectValue placeholder={tEntities('selectVehicle')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">-</SelectItem>
                                {formData.vehicles.map((vehicle) => (
                                  <SelectItem key={vehicle.id} value={vehicle.id}>
                                    {vehicle.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      </form.Field>
                    )}
                  </form.Subscribe>
                </>
              )}
            </FieldGroup>

            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                {tCommon('cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {tCommon('save')}
              </Button>
            </div>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
