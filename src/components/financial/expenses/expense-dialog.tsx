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

interface ExpenseDialogProps {
  mode: "create" | "edit";
  expense?: {
    id: string;
    description: string | null;
    amount: number;
    date: Date;
    kmDriven: number | null;
    receiptUrl: string | null;
    expenseTypeId: string;
    paymentMethodId: string | null;
    driverId: string | null;
    vehicleId: string | null;
  };
}

export function ExpenseDialog({ mode, expense }: ExpenseDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('shared.financial.expenses');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    description: expense?.description || "",
    amount: expense?.amount.toString() || "",
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    kmDriven: expense?.kmDriven?.toString() || "",
    receiptUrl: expense?.receiptUrl || "",
    expenseTypeId: expense?.expenseTypeId || "",
    paymentMethodId: expense?.paymentMethodId || "",
    driverId: expense?.driverId || "",
    vehicleId: expense?.vehicleId || "",
  });

  const isOpen = pathname.includes("/expenses");

  function handleClose() {
    router.back();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        // TODO: Implement create/update expense actions
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
