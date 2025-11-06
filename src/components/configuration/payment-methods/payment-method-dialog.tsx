'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createPaymentMethod, updatePaymentMethod, type PaymentMethodFormData } from "@/app/[locale]/(financial)/dashboard/payment-methods/actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";

interface PaymentMethodDialogProps {
  mode: "create" | "edit";
  paymentMethod?: {
    id: string;
    name: string;
    feeType: string;
    feePercentage: number | null;
    feeFixed: number | null;
  };
}

export function PaymentMethodDialog({ mode, paymentMethod }: PaymentMethodDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('configuration.paymentMethods');
  const tCommon = useScopedI18n('common');
  const [isPending, startTransition] = useTransition();

  const isOpen = pathname.includes("/dashboard/payment-methods");

  const form = useForm({
    defaultValues: {
      name: paymentMethod?.name || "",
      feeType: paymentMethod?.feeType || "NONE",
      feePercentage: paymentMethod?.feePercentage || null,
      feeFixed: paymentMethod?.feeFixed || null,
    },
    onSubmit: async ({ value }: { value: PaymentMethodFormData }) => {
      startTransition(async () => {
        try {
          if (mode === "create") {
            await createPaymentMethod(value);
            toast.success(tCommon('createSuccess'));
            router.back();
          } else {
            await updatePaymentMethod(paymentMethod!.id, value);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t('new') : t('edit')}
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
              <form.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="name">{t('name')}</FieldLabel>
                    <Input
                      id="name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="feeType">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="feeType">{t('feeType')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger id="feeType">
                        <SelectValue placeholder={t('feeTypeSelect')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">{t('feeTypeNone')}</SelectItem>
                        <SelectItem value="PERCENTAGE">{t('feeTypePercentage')}</SelectItem>
                        <SelectItem value="FIXED">{t('feeTypeFixed')}</SelectItem>
                        <SelectItem value="BOTH">{t('feeTypeBoth')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.values.feeType}>
                {(feeType) => (
                  <>
                    {(feeType === "PERCENTAGE" || feeType === "BOTH") && (
                      <form.Field name="feePercentage">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="feePercentage">{t('feePercentage')}</FieldLabel>
                            <Input
                              id="feePercentage"
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={field.state.value ?? ""}
                              onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : null)}
                              placeholder={t('feePercentagePlaceholder')}
                            />
                          </Field>
                        )}
                      </form.Field>
                    )}

                    {(feeType === "FIXED" || feeType === "BOTH") && (
                      <form.Field name="feeFixed">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="feeFixed">{t('feeFixed')}</FieldLabel>
                            <Input
                              id="feeFixed"
                              type="number"
                              step="0.01"
                              min="0"
                              value={field.state.value ?? ""}
                              onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : null)}
                              placeholder={t('feeFixedPlaceholder')}
                            />
                          </Field>
                        )}
                      </form.Field>
                    )}
                  </>
                )}
              </form.Subscribe>
            </FieldGroup>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
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
