"use client"

import { useTransition } from "react"
import { useForm } from "@tanstack/react-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { updatePreferences } from "@/app/[locale]/(financial)/dashboard/(user)/preferences/actions"

interface PreferencesFormProps {
  initialData: {
    theme: string
    language: string
    currency: string
    timezone: string
    use24HourFormat: boolean
  }
  translations: {
    appearanceTitle: string
    appearanceDescription: string
    theme: string
    light: string
    dark: string
    system: string
    language: string
    english: string
    portuguese: string
    regionalTitle: string
    regionalDescription: string
    currency: string
    usDollar: string
    brazilianReal: string
    euro: string
    timezone: string
    saoPaulo: string
    newYork: string
    london: string
    timeFormat: string
    timeFormatDescription: string
    saveChanges: string
    saving: string
  }
}

export function PreferencesForm({ initialData, translations }: PreferencesFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      theme: initialData.theme,
      language: initialData.language,
      currency: initialData.currency,
      timezone: initialData.timezone,
      use24Hour: initialData.use24HourFormat,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          const result = await updatePreferences({
            theme: value.theme as "light" | "dark" | "system",
            language: value.language,
            timezone: value.timezone,
          })

          if (result.success) {
            toast.success("Preferences saved successfully")
          }
        } catch {
          toast.error("Failed to save preferences")
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
      <FieldGroup>
        <FieldSet>
          <div>
            <h2 className="text-lg font-semibold">{translations.appearanceTitle}</h2>
            <p className="text-sm text-muted-foreground">{translations.appearanceDescription}</p>
          </div>
          <FieldGroup>
            <form.Field name="theme">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{translations.theme}</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={translations.theme} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{translations.light}</SelectItem>
                      <SelectItem value="dark">{translations.dark}</SelectItem>
                      <SelectItem value="system">{translations.system}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
            <form.Field name="language">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{translations.language}</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={translations.language} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{translations.english}</SelectItem>
                      <SelectItem value="pt">{translations.portuguese}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <div>
            <h2 className="text-lg font-semibold">{translations.regionalTitle}</h2>
            <p className="text-sm text-muted-foreground">{translations.regionalDescription}</p>
          </div>
          <FieldGroup>
            <form.Field name="currency">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{translations.currency}</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={translations.currency} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - {translations.usDollar}</SelectItem>
                      <SelectItem value="brl">BRL - {translations.brazilianReal}</SelectItem>
                      <SelectItem value="eur">EUR - {translations.euro}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
            <form.Field name="timezone">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{translations.timezone}</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder={translations.timezone} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-saopaulo">{translations.saoPaulo}</SelectItem>
                      <SelectItem value="america-newyork">{translations.newYork}</SelectItem>
                      <SelectItem value="europe-london">{translations.london}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
            <form.Field name="use24Hour">
              {(field) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel htmlFor={field.name}>{translations.timeFormat}</FieldLabel>
                    <FieldDescription>{translations.timeFormatDescription}</FieldDescription>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </FieldSet>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? translations.saving : translations.saveChanges}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
