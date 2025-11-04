'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createVehicle, updateVehicle, type VehicleFormData } from "@/app/[locale]/(financial)/dashboard/vehicles/actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface VehicleDialogProps {
  mode: "create" | "edit";
  vehicle?: {
    id: string;
    name: string;
    plate: string | null;
    model: string | null;
    year: number | null;
  };
}

export function VehicleDialog({ mode, vehicle }: VehicleDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('shared.configuration.vehicles');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<VehicleFormData>({
    name: vehicle?.name || "",
    plate: vehicle?.plate || "",
    model: vehicle?.model || "",
    year: vehicle?.year || undefined,
  });

  const isOpen = pathname.includes("/dashboard/vehicles");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createVehicle(formData);
          toast.success(tCommon('createSuccess'));
          router.back();
        } else {
          await updateVehicle(vehicle!.id, formData);
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
            <Label htmlFor="plate">{t('plate')}</Label>
            <Input
              id="plate"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">{t('model')}</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">{t('year')}</Label>
            <Input
              id="year"
              type="number"
              value={formData.year || ""}
              onChange={(e) => setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value) : undefined })}
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
