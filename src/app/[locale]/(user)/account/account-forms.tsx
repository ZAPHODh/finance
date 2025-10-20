"use client"

import { useForm } from "@tanstack/react-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldSeparator,
} from "@/components/ui/field"

interface ProfileFormProps {
  defaultName: string
  defaultEmail: string
  translations: {
    profileTitle: string
    profileDescription: string
    name: string
    email: string
    save: string
  }
}

export function ProfileForm({ defaultName, defaultEmail, translations }: ProfileFormProps) {
  const form = useForm({
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
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
            <Button type="submit">{translations.save}</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

interface SecurityFormProps {
  translations: {
    securityTitle: string
    securityDescription: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
    changePassword: string
  }
}

export function SecurityForm({ translations }: SecurityFormProps) {
  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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
      <FieldSet>
        <div>
          <h2 className="text-lg font-semibold">{translations.securityTitle}</h2>
          <p className="text-sm text-muted-foreground">{translations.securityDescription}</p>
        </div>
        <FieldGroup>
          <form.Field name="currentPassword">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{translations.currentPassword}</FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="newPassword">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{translations.newPassword}</FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>{translations.confirmPassword}</FieldLabel>
                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <div>
            <Button type="submit">{translations.changePassword}</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
