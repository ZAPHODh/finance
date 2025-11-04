'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createExpenseType, updateExpenseType, type ExpenseTypeFormData } from "@/app/[locale]/(financial)/dashboard/expense-types/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ExpenseTypeDialogProps {
  mode: "create" | "edit";
  expenseType?: {
    id: string;
    name: string;
    icon: string | null;
  };
}

export function ExpenseTypeDialog({ mode, expenseType }: ExpenseTypeDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('shared.configuration.expenseTypes');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<ExpenseTypeFormData>({
    name: expenseType?.name || "",
    icon: expenseType?.icon || "",
  });

  const isOpen = pathname.includes("/dashboard/expense-types");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createExpenseType(formData);
          toast.success(tCommon('createSuccess'));
          router.back();
        } else {
          await updateExpenseType(expenseType!.id, formData);
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
            <Label htmlFor="icon">{t('icon')}</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="💰"
            />
          </div>
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
