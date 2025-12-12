'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createDriver, updateDriver } from "@/app/[locale]/(financial)/dashboard/drivers/actions";
import { useForm } from "@tanstack/react-form";
import { Field, FieldLabel, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { isValidCPF, isValidPhone } from "@brazilian-utils/brazilian-utils";

interface DriverDialogProps {
  mode: "create" | "edit";
  driver?: {
    id: string;
    name: string;
    cpf: string | null;
    cnh: string | null;
    phone: string | null;
  };
}

export function DriverDialog({ mode, driver }: DriverDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('configuration.drivers');
  const tCommon = useScopedI18n('common');
  const tValidation = useScopedI18n('shared.validation');

  const form = useForm({
    defaultValues: {
      name: driver?.name || "",
      cpf: driver?.cpf || "",
      cnh: driver?.cnh || "",
      phone: driver?.phone || "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "create") {
          await createDriver(value);
          toast.success(tCommon('createSuccess'));
          router.back();
        } else {
          await updateDriver(driver!.id, value);
          toast.success(tCommon('updateSuccess'));
          router.back();
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
    },
  });

  const isOpen = pathname.includes("/dashboard/drivers");

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
                    if (!value) return t('nameRequired');
                    if (value.length < 2) return t('nameTooShort');
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {t('name')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
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

              <form.Field
                name="cpf"
                validators={{
                  onChange: ({ value }) => {
                    if (value && !isValidCPF(value.replace(/\D/g, ''))) {
                      return tValidation('brazilian.cpf.invalid');
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>CPF (optional)</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                      placeholder="000.000.000-00"
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

              <form.Field
                name="cnh"
                validators={{
                  onChange: ({ value }) => {
                    if (value && !/^\d{11}$/.test(value.replace(/\D/g, ''))) {
                      return tValidation('brazilian.cnh.invalid');
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>CNH (optional)</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                      placeholder="00000000000"
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

              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) => {
                    if (value && !isValidPhone(value.replace(/\D/g, ''))) {
                      return tValidation('brazilian.phone.invalid');
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Phone (optional)</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                      placeholder="(00) 00000-0000"
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