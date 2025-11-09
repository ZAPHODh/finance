'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createVehicle, updateVehicle } from "@/app/[locale]/(financial)/dashboard/vehicles/actions";
import type { VehicleFormData } from "@/types/forms";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

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
  const t = useScopedI18n('configuration.vehicles');
  const tCommon = useScopedI18n('common');

  const isOpen = pathname.includes("/dashboard/vehicles");

  const form = useForm({
    defaultValues: {
      name: vehicle?.name || "",
      plate: vehicle?.plate || "",
      model: vehicle?.model || "",
      year: vehicle?.year || undefined,
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "create") {
          await createVehicle(value);
          toast.success(tCommon('createSuccess'));
          router.back();
        } else {
          await updateVehicle(vehicle!.id, value);
          toast.success(tCommon('updateSuccess'));
          router.back();
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
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
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldSet>
            <FieldGroup>
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value?.trim()) return t('nameRequired');
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{t('name')}</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                      required
                    />
                    <FieldError>
                      {field.state.meta.errors?.[0] && (
                        <p className="mt-2 text-xs text-destructive">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </FieldError>
                  </Field>
                )}
              </form.Field>

              <form.Field name="plate">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{t('plate')}</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="model">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{t('model')}</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="year">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{t('year')}</FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      value={field.state.value || ''}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      disabled={form.state.isSubmitting}
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={form.state.isSubmitting}
              >
                {tCommon('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={form.state.isSubmitting}
              >
                {form.state.isSubmitting && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tCommon('save')}
              </Button>
            </div>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}