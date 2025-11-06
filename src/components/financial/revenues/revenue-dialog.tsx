'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { createRevenue, updateRevenue } from "@/app/[locale]/(financial)/dashboard/revenues/actions";
import { useTransition } from "react";

interface RevenueDialogProps {
  mode: "create" | "edit";
  revenue?: {
    id: string;
    amount: number;
    date: Date;
    kmDriven: number | null;
    hoursWorked: number | null;
    receiptUrl: string | null;
    platformIds: string[];
    paymentMethodId: string | null;
    driverId: string | null;
    vehicleId: string | null;
  };
  platforms?: Array<{ id: string; name: string }>;
  paymentMethods?: Array<{ id: string; name: string }>;
  drivers?: Array<{ id: string; name: string }>;
  vehicles?: Array<{ id: string; name: string }>;
}

export function RevenueDialog({
  mode,
  revenue,
  platforms = [],
  paymentMethods = [],
  drivers = [],
  vehicles = []
}: RevenueDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('financial.revenues');
  const tCommon = useScopedI18n('common');
  const tEntities = useScopedI18n('entities');
  const [isPending, startTransition] = useTransition();

  const isOpen = pathname.includes("/revenues");

  const form = useForm({
    defaultValues: {
      amount: revenue?.amount || 0,
      date: revenue?.date ? new Date(revenue.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      kmDriven: revenue?.kmDriven || undefined,
      hoursWorked: revenue?.hoursWorked || undefined,
      platformIds: revenue?.platformIds || [],
      paymentMethodId: revenue?.paymentMethodId || "",
      driverId: revenue?.driverId || "",
      vehicleId: revenue?.vehicleId || "",
    },
    onSubmit: async ({ value }) => {
      const data = {
        amount: Number(value.amount),
        date: new Date(value.date),
        kmDriven: value.kmDriven ? Number(value.kmDriven) : undefined,
        hoursWorked: value.hoursWorked ? Number(value.hoursWorked) : undefined,
        platformIds: value.platformIds,
        paymentMethodId: value.paymentMethodId && value.paymentMethodId !== "none" ? value.paymentMethodId : undefined,
        driverId: value.driverId && value.driverId !== "none" ? value.driverId : undefined,
        vehicleId: value.vehicleId && value.vehicleId !== "none" ? value.vehicleId : undefined,
      };

      startTransition(async () => {
        try {
          if (mode === "create") {
            await createRevenue(data);
            toast.success(tCommon('createSuccess'));
            router.back();
          } else if (revenue) {
            await updateRevenue(revenue.id, data);
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

              <form.Field name="platformIds">
                {(field) => (
                  <Field>
                    <FieldLabel>{t('platforms')}</FieldLabel>
                    <div className="space-y-2">
                      {platforms.map((platform) => (
                        <div key={platform.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`platform-${platform.id}`}
                            checked={field.state.value.includes(platform.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.handleChange([...field.state.value, platform.id]);
                              } else {
                                field.handleChange(field.state.value.filter((id: string) => id !== platform.id));
                              }
                            }}
                          />
                          <label
                            htmlFor={`platform-${platform.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {platform.name}
                          </label>
                        </div>
                      ))}
                    </div>
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
                        <SelectItem value="none">-</SelectItem>
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
