'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, usePathname } from "next/navigation";
import { useScopedI18n } from "@/locales/client";
import { createPlatform, updatePlatform } from "@/app/[locale]/(financial)/dashboard/platforms/actions";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

interface PlatformDialogProps {
  mode: "create" | "edit";
  platform?: {
    id: string;
    name: string;
  };
}

export function PlatformDialog({ mode, platform }: PlatformDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useScopedI18n('configuration.platforms');
  const tCommon = useScopedI18n('common');

  const isOpen = pathname.includes("/dashboard/platforms");

  const form = useForm({
    defaultValues: {
      name: platform?.name || "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (mode === "create") {
          await createPlatform(value);
          toast.success(tCommon('createSuccess'));
          router.back();
        } else {
          await updatePlatform(platform!.id, value);
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
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                if (!value) return t('nameRequired');
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{t('name')}</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
                {field.state.meta.errors?.[0] && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
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