'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
}

export function RevenueDialog({ mode, revenue }: RevenueDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('shared.financial.revenues');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    description: revenue?.description || "",
    amount: revenue?.amount.toString() || "",
    date: revenue?.date ? new Date(revenue.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    kmDriven: revenue?.kmDriven?.toString() || "",
    hoursWorked: revenue?.hoursWorked?.toString() || "",
    tripType: revenue?.tripType || "",
    receiptUrl: revenue?.receiptUrl || "",
    revenueTypeId: revenue?.revenueTypeId || "",
    companyId: revenue?.companyId || "",
    paymentMethodId: revenue?.paymentMethodId || "",
    driverId: revenue?.driverId || "",
    vehicleId: revenue?.vehicleId || "",
  });

  const isOpen = pathname.includes("/revenues");

  function handleClose() {
    router.back();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        // TODO: Implement create/update revenue actions
        toast.success(tCommon(mode === "create" ? 'createSuccess' : 'updateSuccess'));
        handleClose();
      } catch {
        toast.error(tCommon('error'));
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t('new') : t('edit')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{t('amount')}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">{t('date')}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kmDriven">{t('kmDriven')}</Label>
            <Input
              id="kmDriven"
              type="number"
              step="0.01"
              value={formData.kmDriven}
              onChange={(e) => setFormData({ ...formData, kmDriven: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hoursWorked">{t('hoursWorked')}</Label>
            <Input
              id="hoursWorked"
              type="number"
              step="0.01"
              value={formData.hoursWorked}
              onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tripType">{t('tripType')}</Label>
            <Input
              id="tripType"
              value={formData.tripType}
              onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
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
