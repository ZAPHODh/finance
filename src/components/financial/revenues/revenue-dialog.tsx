'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { createRevenue, updateRevenue } from "@/app/[locale]/(financial)/dashboard/revenues/actions";
import { useAction } from "next-safe-action/hooks";

interface RevenueDialogProps {
  mode: "create" | "edit";
  revenue?: {
    id: string;
    description: string | null;
    amount: number;
    date: Date;
    kmDriven: number | null;
    hoursWorked: number | null;
    tripType: string | null;
    receiptUrl: string | null;
    revenueTypeId: string | null;
    companyId: string | null;
    paymentMethodId: string | null;
    driverId: string | null;
    vehicleId: string | null;
  };
  revenueTypes?: Array<{ id: string; name: string }>;
  companies?: Array<{ id: string; name: string }>;
  paymentMethods?: Array<{ id: string; name: string }>;
  drivers?: Array<{ id: string; name: string }>;
  vehicles?: Array<{ id: string; name: string }>;
}

export function RevenueDialog({
  mode,
  revenue,
  revenueTypes = [],
  companies = [],
  paymentMethods = [],
  drivers = [],
  vehicles = []
}: RevenueDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('shared.financial.revenues');
  const tCommon = useScopedI18n('shared.common');

  const { execute: executeCreate, isPending: isCreating } = useAction(createRevenue, {
    onSuccess: () => {
      toast.success(tCommon('createSuccess'));
    },
    onError: (error) => {
      toast.error(error.error.serverError?.message || tCommon('error'));
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateRevenue, {
    onSuccess: () => {
      toast.success(tCommon('updateSuccess'));
    },
    onError: (error) => {
      toast.error(error.error.serverError?.message || tCommon('error'));
    },
  });

  const isOpen = pathname.includes("/revenues");
  const isPending = isCreating || isUpdating;

  function handleClose() {
    router.back();
  }

  const form = useForm({
    defaultValues: {
      description: revenue?.description || "",
      amount: revenue?.amount || 0,
      date: revenue?.date ? new Date(revenue.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      kmDriven: revenue?.kmDriven || undefined,
      hoursWorked: revenue?.hoursWorked || undefined,
      tripType: revenue?.tripType || "",
      receiptUrl: revenue?.receiptUrl || "",
      revenueTypeId: revenue?.revenueTypeId || "",
      companyId: revenue?.companyId || "",
      paymentMethodId: revenue?.paymentMethodId || "",
      driverId: revenue?.driverId || "",
      vehicleId: revenue?.vehicleId || "",
    },
    onSubmit: async ({ value }) => {
      const data = {
        description: value.description || undefined,
        amount: Number(value.amount),
        date: new Date(value.date),
        kmDriven: value.kmDriven ? Number(value.kmDriven) : undefined,
        hoursWorked: value.hoursWorked ? Number(value.hoursWorked) : undefined,
        tripType: value.tripType || undefined,
        receiptUrl: value.receiptUrl || undefined,
        revenueTypeId: value.revenueTypeId || undefined,
        companyId: value.companyId || undefined,
        paymentMethodId: value.paymentMethodId || undefined,
        driverId: value.driverId || undefined,
        vehicleId: value.vehicleId || undefined,
      };

      if (mode === "create") {
        executeCreate(data);
      } else if (revenue) {
        executeUpdate({ id: revenue.id, data });
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              <form.Field name="description">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="description">{t('description')}</FieldLabel>
                    <Textarea
                      id="description"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

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

              <form.Field name="companyId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="companyId">{t('company')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id="companyId">
                        <SelectValue placeholder={t('company')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="revenueTypeId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="revenueTypeId">{t('revenueType')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id="revenueTypeId">
                        <SelectValue placeholder={t('revenueType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-</SelectItem>
                        {revenueTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="paymentMethodId">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="paymentMethodId">{t('paymentMethod')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id="paymentMethodId">
                        <SelectValue placeholder={t('paymentMethod')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-</SelectItem>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name}
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
                    <FieldLabel htmlFor="driverId">{t('driver')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id="driverId">
                        <SelectValue placeholder={t('driver')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-</SelectItem>
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
                    <FieldLabel htmlFor="vehicleId">{t('vehicle')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id="vehicleId">
                        <SelectValue placeholder={t('vehicle')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-</SelectItem>
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

              <form.Field name="kmDriven">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="kmDriven">{t('kmDriven')}</FieldLabel>
                    <Input
                      id="kmDriven"
                      type="number"
                      step="0.01"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="hoursWorked">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="hoursWorked">{t('hoursWorked')}</FieldLabel>
                    <Input
                      id="hoursWorked"
                      type="number"
                      step="0.01"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="tripType">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="tripType">{t('tripType')}</FieldLabel>
                    <Input
                      id="tripType"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <Field orientation="horizontal">
                <Button type="button" variant="outline" onClick={handleClose}>
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
