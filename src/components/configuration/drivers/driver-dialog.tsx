'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createDriver, updateDriver, type DriverFormData } from "@/app/[locale]/(financial)/dashboard/drivers/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface DriverDialogProps {
  mode: "create" | "edit";
  driver?: {
    id: string;
    name: string;
  };
}

export function DriverDialog({ mode, driver }: DriverDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('shared.configuration.drivers');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<DriverFormData>({
    name: driver?.name || "",
  });

  const isOpen = pathname.includes("/dashboard/drivers");

  function handleClose() {
    router.back();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createDriver(formData);
          toast.success(tCommon('createSuccess'));
        } else {
          await updateDriver(driver!.id, formData);
          toast.success(tCommon('updateSuccess'));
        }
      } catch {
        toast.error(tCommon('error'));
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
