'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createPaymentMethod, updatePaymentMethod, type PaymentMethodFormData } from "@/app/[locale]/(financial)/dashboard/payment-methods/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
  const t = useScopedI18n('shared.configuration.paymentMethods');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<PaymentMethodFormData>({
    name: paymentMethod?.name || "",
    feeType: paymentMethod?.feeType || "NONE",
    feePercentage: paymentMethod?.feePercentage || null,
    feeFixed: paymentMethod?.feeFixed || null,
  });

  const isOpen = pathname.includes("/dashboard/payment-methods");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createPaymentMethod(formData);
          toast.success(tCommon('createSuccess'));
          router.back();
        } else {
          await updatePaymentMethod(paymentMethod!.id, formData);
          toast.success(tCommon('updateSuccess'));
          router.back();
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t('new') : t('edit')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feeType">{t('feeType')}</Label>
            <Select
              value={formData.feeType}
              onValueChange={(value) => setFormData({ ...formData, feeType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('feeTypeSelect')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">{t('feeTypeNone')}</SelectItem>
                <SelectItem value="PERCENTAGE">{t('feeTypePercentage')}</SelectItem>
                <SelectItem value="FIXED">{t('feeTypeFixed')}</SelectItem>
                <SelectItem value="BOTH">{t('feeTypeBoth')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.feeType === "PERCENTAGE" || formData.feeType === "BOTH") && (
            <div className="space-y-2">
              <Label htmlFor="feePercentage">{t('feePercentage')}</Label>
              <Input
                id="feePercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.feePercentage || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  feePercentage: e.target.value ? parseFloat(e.target.value) : null
                })}
                placeholder={t('feePercentagePlaceholder')}
              />
            </div>
          )}

          {(formData.feeType === "FIXED" || formData.feeType === "BOTH") && (
            <div className="space-y-2">
              <Label htmlFor="feeFixed">{t('feeFixed')}</Label>
              <Input
                id="feeFixed"
                type="number"
                step="0.01"
                min="0"
                value={formData.feeFixed || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  feeFixed: e.target.value ? parseFloat(e.target.value) : null
                })}
                placeholder={t('feeFixedPlaceholder')}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {tCommon('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
