'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createExpenseType, updateExpenseType } from "@/app/[locale]/(financial)/dashboard/expense-types/actions";
import { useForm } from "@tanstack/react-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

interface ExpenseTypeDialogProps {
  mode: "create" | "edit";
  expenseType?: {
    id: string;
    name: string;
  };
}

export function ExpenseTypeDialog({ mode, expenseType }: ExpenseTypeDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('shared.configuration.expenseTypes');
  const tCommon = useScopedI18n('shared.common');

  const form = useForm({
    defaultValues: {
      name: expenseType?.name || "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "create") {
          await createExpenseType(value);
          toast.success(tCommon('createSuccess'));
          router.back();
        } else {
          await updateExpenseType(expenseType!.id, value);
          toast.success(tCommon('updateSuccess'));
          router.back();
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
    },
  });

  const isOpen = pathname.includes("/dashboard/expense-types");

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
          className="space-y-4"
        >
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
                  placeholder={t('namePlaceholder')}
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
        </form>
      </DialogContent>
    </Dialog>
  );
}