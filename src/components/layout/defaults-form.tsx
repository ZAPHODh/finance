"use client"

import { useTransition, useEffect, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { updateDefaults, getDriversAndVehicles } from "@/app/[locale]/(financial)/dashboard/preferences/actions"

interface DefaultsFormProps {
  initialData: {
    defaultDriverId: string | null
    defaultVehicleId: string | null
  }
  translations: {
    defaultsTitle: string
    defaultsDescription: string
    defaultDriver: string
    defaultDriverDescription: string
    defaultVehicle: string
    defaultVehicleDescription: string
    none: string
    saveChanges: string
    saving: string
    successMessage: string
  }
}

export function DefaultsForm({ initialData, translations }: DefaultsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [drivers, setDrivers] = useState<Array<{ id: string; name: string; isSelf: boolean }>>([])
  const [vehicles, setVehicles] = useState<Array<{ id: string; name: string; isPrimary: boolean }>>([])

  useEffect(() => {
    getDriversAndVehicles().then(data => {
      setDrivers(data.drivers)
      setVehicles(data.vehicles)
    })
  }, [])

  const form = useForm({
    defaultValues: {
      defaultDriverId: initialData.defaultDriverId || "",
      defaultVehicleId: initialData.defaultVehicleId || "",
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          await updateDefaults({
            defaultDriverId: value.defaultDriverId || null,
            defaultVehicleId: value.defaultVehicleId || null,
          })
          toast.success(translations.successMessage)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to update defaults")
        }
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldSet>
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{translations.defaultsTitle}</h3>
          <p className="text-sm text-muted-foreground">{translations.defaultsDescription}</p>
        </div>

        <FieldGroup>
          <form.Field name="defaultDriverId">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="defaultDriverId">{translations.defaultDriver}</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id="defaultDriverId">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{translations.none}</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} {driver.isSelf && "(Just Me)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>{translations.defaultDriverDescription}</FieldDescription>
              </Field>
            )}
          </form.Field>

          <form.Field name="defaultVehicleId">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="defaultVehicleId">{translations.defaultVehicle}</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id="defaultVehicleId">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{translations.none}</SelectItem>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} {vehicle.isPrimary && "(Primary)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>{translations.defaultVehicleDescription}</FieldDescription>
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <Button type="submit" disabled={isPending}>
          {isPending ? translations.saving : translations.saveChanges}
        </Button>
      </FieldSet>
    </form>
  )
}
