"use client"

import { useForm } from "@tanstack/react-form"
import { useScopedI18n } from "@/locales/client"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createBudget, updateBudget } from "@/app/[locale]/(financial)/budgets/actions"
import { toast } from "sonner"
import { useTransition } from "react"
import type { Budget } from "@prisma/client"

interface BudgetFormProps {
    expenseTypes: { id: string; name: string; icon: string | null }[]
    budget?: Budget
}

export function BudgetForm({ expenseTypes, budget }: BudgetFormProps) {
    const t = useScopedI18n("shared.budgets")
    const tCommon = useScopedI18n("shared.common")
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        defaultValues: {
            name: budget?.name || "",
            expenseTypeId: budget?.expenseTypeId || "",
            monthlyLimit: budget?.monthlyLimit || 0,
            alertThreshold: budget?.alertThreshold ? budget.alertThreshold * 100 : 80,
            period: budget?.period || new Date().toISOString().slice(0, 7), // YYYY-MM
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    if (budget) {
                        await updateBudget(budget.id, {
                            ...value,
                            alertThreshold: value.alertThreshold / 100,
                        })
                        toast.success(tCommon("updateSuccess"))
                    } else {
                        await createBudget({
                            ...value,
                            alertThreshold: value.alertThreshold / 100,
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
                                    {t("name")} ({tCommon("optional")})
                                </FieldLabel>
                                <Input
                                    id="name"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Ex: Orçamento de Combustível"
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="expenseTypeId">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="expenseTypeId">
                                    {t("expenseType")}
                                </FieldLabel>
                                <select
                                    id="expenseTypeId"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    required
                                >
                                    <option value="">{tCommon("selectExpenseType")}</option>
                                    {expenseTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="monthlyLimit">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="monthlyLimit">
                                    {t("monthlyLimit")}
                                </FieldLabel>
                                <Input
                                    id="monthlyLimit"
                                    type="number"
                                    step="0.01"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                    placeholder="2000"
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="alertThreshold">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="alertThreshold">
                                    {t("alertThreshold")} (%)
                                </FieldLabel>
                                <Input
                                    id="alertThreshold"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                    placeholder="80"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {tCommon("alertThresholdHint")}
                                </p>
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
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>
                </FieldGroup>

                <div className="flex gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? tCommon("saving") : tCommon("save")}
                    </Button>
                </div>
            </FieldSet>
        </form>
    )
}
