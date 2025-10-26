'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createRevenueType, updateRevenueType, type RevenueTypeFormData } from "@/app/[locale]/(financial)/dashboard/revenue-types/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface RevenueTypeDialogProps {
  mode: "create" | "edit";
  revenueType?: {
    id: string;
    name: string;
    icon: string | null;
  };
}

export function RevenueTypeDialog({ mode, revenueType }: RevenueTypeDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('shared.configuration.revenueTypes');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<RevenueTypeFormData>({
    name: revenueType?.name || "",
    icon: revenueType?.icon || "",
  });

  const isOpen = pathname.includes("/dashboard/revenue-types");

  function handleClose() {
    router.back();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createRevenueType(formData);
          toast.success(tCommon('createSuccess'));
          router.push('/dashboard/revenue-types');
        } else {
          await updateRevenueType(revenueType!.id, formData);
          toast.success(tCommon('updateSuccess'));
          router.push('/dashboard/revenue-types');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
