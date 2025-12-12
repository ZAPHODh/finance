"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field"
import { toast } from "sonner"
import { useTransition } from "react"
import { updateProfileAction } from "@/app/[locale]/(financial)/dashboard/(user)/account/actions"
import { isValidCPF, isValidCNPJ, isValidCEP, isValidPhone } from "@brazilian-utils/brazilian-utils"
import { useScopedI18n } from "@/locales/client"

interface ProfileFormProps {
  defaultName: string
  defaultEmail: string
  defaultCpfCnpj?: string | null
  defaultPhone?: string | null
  defaultCep?: string | null
  translations: {
    profileTitle: string
    profileDescription: string
    name: string
    email: string
    save: string
    profileUpdated: string
    profileUpdateError: string
  }
}

export function ProfileForm({ defaultName, defaultEmail, defaultCpfCnpj, defaultPhone, defaultCep, translations }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const tValidation = useScopedI18n('shared.validation')

  const form = useForm({
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      cpfCnpj: defaultCpfCnpj || "",
      phone: defaultPhone || "",
      cep: defaultCep || "",
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          const result = await updateProfileAction(value)

          if (result.success) {
            toast.success(translations.profileUpdated)
          }
        } catch {
          toast.error(translations.profileUpdateError)
        }
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldSet>
        <div>
          <h2 className="text-lg font-semibold">{translations.profileTitle}</h2>
          <p className="text-sm text-muted-foreground">{translations.profileDescription}</p>
        </div>
        <FieldGroup>
          <form.Field name="name">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{translations.name}</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{translations.email}</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  disabled
                />
              </Field>
            )}
          </form.Field>

          <form.Field
            name="cpfCnpj"
            validators={{
              onChange: ({ value }) => {
                if (!value) return undefined;
                const cleaned = value.replace(/\D/g, '');
                if (cleaned.length === 11 && !isValidCPF(cleaned)) {
                  return tValidation('brazilian.cpf.invalid');
                }
                if (cleaned.length === 14 && !isValidCNPJ(cleaned)) {
                  return tValidation('brazilian.cnpj.invalid');
                }
                if (cleaned.length !== 11 && cleaned.length !== 14) {
                  return tValidation('brazilian.cpfOrCnpj.invalid');
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>CPF/CNPJ (optional)</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  placeholder="000.000.000-00 or 00.000.000/0000-00"
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
                  disabled={isPending}
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

          <form.Field
            name="cep"
            validators={{
              onChange: ({ value }) => {
                if (value && !isValidCEP(value.replace(/\D/g, ''))) {
                  return tValidation('brazilian.cep.invalid');
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>CEP (optional)</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isPending}
                  placeholder="00000-000"
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

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : translations.save}
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

