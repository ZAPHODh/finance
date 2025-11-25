"use client"

import { useTransition } from "react"
import { useForm } from "@tanstack/react-form"
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
import { updateNotificationSettings, updatePrivacySettings } from "@/app/[locale]/(financial)/dashboard/(user)/settings/actions"

interface SettingsFormProps {
  initialData: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    analytics: boolean
    profileVisibility: boolean
  }
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
    saveChanges: string
    saving: string
  }
}

export function SettingsForm({ initialData, translations }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      emailNotifications: initialData.emailNotifications,
      pushNotifications: initialData.pushNotifications,
      marketing: initialData.marketingEmails,
      analytics: initialData.analytics,
      profileVisibility: initialData.profileVisibility,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          const notificationsResult = await updateNotificationSettings({
            emailNotifications: value.emailNotifications,
            pushNotifications: value.pushNotifications,
            marketingEmails: value.marketing,
          })

          if (!notificationsResult.success) {
            toast.error("Failed to update notification settings")
            return
          }

          const privacyResult = await updatePrivacySettings({
            analytics: value.analytics,
            profileVisibility: value.profileVisibility,
          })

          if (!privacyResult.success) {
            toast.error("Failed to update privacy settings")
            return
          }

          toast.success("Settings saved successfully")
        } catch (error) {
          toast.error("Failed to save settings")
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? translations.saving : translations.saveChanges}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
