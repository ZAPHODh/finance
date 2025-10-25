"use client"

import { useForm } from "@tanstack/react-form"
import { useScopedI18n } from "@/locales/client"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { createGoal, updateGoal } from "@/app/[locale]/(financial)/goals/actions"
import { toast } from "sonner"
import { useTransition } from "react"
import { GoalType } from "@prisma/client"
import type { Goal } from "@prisma/client"

interface GoalFormProps {
    drivers: { id: string; name: string }[]
    vehicles: { id: string; name: string }[]
    goal?: Goal
}

export function GoalForm({ drivers, vehicles, goal }: GoalFormProps) {
    const t = useScopedI18n("shared.goals")
    const tCommon = useScopedI18n("shared.common")
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        defaultValues: {
            name: goal?.name || "",
            type: goal?.type || ("MONTHLY_REVENUE" as GoalType),
            targetValue: goal?.targetValue || 0,
            period: goal?.period || new Date().toISOString().slice(0, 7), // YYYY-MM
            driverId: goal?.driverId || "",
            vehicleId: goal?.vehicleId || "",
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    if (goal) {
                        await updateGoal(goal.id, {
                            ...value,
                            driverId: value.driverId || undefined,
                            vehicleId: value.vehicleId || undefined,
                        })
                        toast.success(tCommon("updateSuccess"))
                    } else {
                        await createGoal({
                            ...value,
                            driverId: value.driverId || undefined,
                            vehicleId: value.vehicleId || undefined,
                        })
                        toast.success(tCommon("createSuccess"))
                    }
                } catch (error) {
                    toast.error(error instanceof Error ? error.message : tCommon("error"))
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
                <FieldGroup>
                    <form.Field name="name">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="name">
                                    {t("name")} (opcional)
                                </FieldLabel>
                                <Input
                                    id="name"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Ex: Meta de Janeiro"
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="type">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="type">{t("type")}</FieldLabel>
                                <select
                                    id="type"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value as GoalType)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="DAILY_REVENUE">{t("types.DAILY_REVENUE")}</option>
                                    <option value="WEEKLY_REVENUE">{t("types.WEEKLY_REVENUE")}</option>
                                    <option value="MONTHLY_REVENUE">{t("types.MONTHLY_REVENUE")}</option>
                                    <option value="MONTHLY_PROFIT">{t("types.MONTHLY_PROFIT")}</option>
                                    <option value="MONTHLY_KM">{t("types.MONTHLY_KM")}</option>
                                    <option value="MONTHLY_HOURS">{t("types.MONTHLY_HOURS")}</option>
                                    <option value="CUSTOM">{t("types.CUSTOM")}</option>
                                </select>
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="targetValue">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="targetValue">
                                    {t("targetValue")}
                                </FieldLabel>
                                <Input
                                    id="targetValue"
                                    type="number"
                                    step="0.01"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                    placeholder="5000"
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="period">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="period">
                                    {t("period")}
                                </FieldLabel>
                                <Input
                                    id="period"
                                    type="month"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Para metas diárias, use formato YYYY-MM-DD
                                </p>
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="driverId">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="driverId">
                                    Motorista (opcional)
                                </FieldLabel>
                                <select
                                    id="driverId"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Todos os motoristas</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id} value={driver.id}>
                                            {driver.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="vehicleId">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="vehicleId">
                                    Veículo (opcional)
                                </FieldLabel>
                                <select
                                    id="vehicleId"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Todos os veículos</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        )}
                    </form.Field>
                </FieldGroup>

                <div className="flex gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Salvando..." : tCommon("save")}
                    </Button>
                </div>
            </FieldSet>
        </form>
    )
}
