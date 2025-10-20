"use client"

import { useForm } from "@tanstack/react-form"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

interface SettingsFormProps {
  translations: {
    notificationsTitle: string
    notificationsDescription: string
    emailNotifications: string
    emailNotificationsDescription: string
    pushNotifications: string
    pushNotificationsDescription: string
    marketing: string
    marketingDescription: string
    privacyTitle: string
    privacyDescription: string
    analytics: string
    analyticsDescription: string
    profileVisibility: string
    profileVisibilityDescription: string
  }
}

export function SettingsForm({ translations }: SettingsFormProps) {
  const form = useForm({
    defaultValues: {
      emailNotifications: false,
      pushNotifications: false,
      marketing: false,
      analytics: true,
      profileVisibility: false,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
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
            <h2 className="text-lg font-semibold">{translations.notificationsTitle}</h2>
            <p className="text-sm text-muted-foreground">{translations.notificationsDescription}</p>
          </div>
          <FieldGroup>
            <form.Field name="emailNotifications">
              {(field) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel htmlFor={field.name}>{translations.emailNotifications}</FieldLabel>
                    <FieldDescription>{translations.emailNotificationsDescription}</FieldDescription>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="pushNotifications">
              {(field) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel htmlFor={field.name}>{translations.pushNotifications}</FieldLabel>
                    <FieldDescription>{translations.pushNotificationsDescription}</FieldDescription>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="marketing">
              {(field) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel htmlFor={field.name}>{translations.marketing}</FieldLabel>
                    <FieldDescription>{translations.marketingDescription}</FieldDescription>
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

        <FieldSet>
          <div>
            <h2 className="text-lg font-semibold">{translations.privacyTitle}</h2>
            <p className="text-sm text-muted-foreground">{translations.privacyDescription}</p>
          </div>
          <FieldGroup>
            <form.Field name="analytics">
              {(field) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel htmlFor={field.name}>{translations.analytics}</FieldLabel>
                    <FieldDescription>{translations.analyticsDescription}</FieldDescription>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="profileVisibility">
              {(field) => (
                <Field orientation="horizontal">
                  <div className="flex-1">
                    <FieldLabel htmlFor={field.name}>{translations.profileVisibility}</FieldLabel>
                    <FieldDescription>{translations.profileVisibilityDescription}</FieldDescription>
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
      </FieldGroup>
    </form>
  )
}
