"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { toast } from "sonner"
import { useTransition } from "react"
import { updateProfileAction } from "@/app/[locale]/(financial)/dashboard/(user)/account/actions"

interface ProfileFormProps {
  defaultName: string
  defaultEmail: string
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

export function ProfileForm({ defaultName, defaultEmail, translations }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          const result = await updateProfileAction({ name: value.name, email: value.email })

          if (result.success) {
            toast.success(translations.profileUpdated)
          }
        } catch (error) {
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

