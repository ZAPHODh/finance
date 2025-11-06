'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { createExpense, updateExpense } from "@/app/[locale]/(financial)/dashboard/expenses/actions";
import { useTransition } from "react";

interface ExpenseDialogProps {
  mode: "create" | "edit";
  expense?: {
    id: string;
    amount: number;
    date: Date;
    receiptUrl: string | null;
    expenseTypeId: string;
    driverId: string | null;
    vehicleId: string | null;
  };
  expenseTypes?: Array<{ id: string; name: string }>;
  drivers?: Array<{ id: string; name: string }>;
  vehicles?: Array<{ id: string; name: string }>;
}

export function ExpenseDialog({
  mode,
  expense,
  expenseTypes = [],
  drivers = [],
  vehicles = []
}: ExpenseDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('financial.expenses');
  const tCommon = useScopedI18n('common');
  const tEntities = useScopedI18n('entities');
  const [isPending, startTransition] = useTransition();

  const isOpen = pathname.includes("/expenses");

  const form = useForm({
    defaultValues: {
      amount: expense?.amount || 0,
      date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      expenseTypeId: expense?.expenseTypeId || "",
      driverId: expense?.driverId || "",
      vehicleId: expense?.vehicleId || "",
    },
    onSubmit: async ({ value }) => {
      const data = {
        amount: Number(value.amount),
        date: new Date(value.date),
        expenseTypeId: value.expenseTypeId,
        driverId: value.driverId && value.driverId !== "none" ? value.driverId : undefined,
        vehicleId: value.vehicleId && value.vehicleId !== "none" ? value.vehicleId : undefined,
      };

      startTransition(async () => {
        try {
          if (mode === "create") {
            await createExpense(data);
            toast.success(tCommon('createSuccess'));
            router.back();
          } else if (expense) {
            await updateExpense(expense.id, data);
            toast.success(tCommon('updateSuccess'));
            router.back();
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : tCommon('error'));
        }
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => router.back()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t('new') : t('edit')}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldSet>
            <FieldGroup>
              <form.Field name="amount">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="amount">{t('amount')}</FieldLabel>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      required
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="date">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="date">{t('date')}</FieldLabel>
                    <Input
                      id="date"
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="expenseTypeId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="expenseTypeId">{t('expenseType')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id="expenseTypeId">
                        <SelectValue placeholder={t('expenseType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="driverId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="driverId">{tEntities('driver')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id="driverId">
                        <SelectValue placeholder={tEntities('driver')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-</SelectItem>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="vehicleId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="vehicleId">{tEntities('vehicle')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id="vehicleId">
                        <SelectValue placeholder={tEntities('vehicle')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-</SelectItem>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <Field orientation="horizontal">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  {tCommon('cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {tCommon('save')}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
