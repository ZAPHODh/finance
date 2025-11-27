"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  X,
  Calendar,
  DollarSign,
  Tag,
  User,
  Car,
  Building2,
  FileText,
  Copy,
  Check,
  Edit,
  Save
} from "lucide-react"
import { useScopedI18n } from "@/locales/client"
import { Field, FieldLabel, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateRevenue } from "@/app/[locale]/(financial)/dashboard/revenues/actions"
import { updateExpense } from "@/app/[locale]/(financial)/dashboard/expenses/actions"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
  id: string
  description: string
  category: string
  amount: number
  type: "revenue" | "expense"
  date: Date
  driver?: string
  driverId?: string | null
  vehicle?: string
  vehicleId?: string | null
  company?: string
  platform?: string
  platformIds?: string[]
  expenseTypeIds?: string[]
  paymentMethodId?: string | null
  kmDriven?: number | null
  hoursWorked?: number | null
}

interface TransactionDrawerProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  formData?: {
    drivers: Array<{ id: string; name: string }>
    vehicles: Array<{ id: string; name: string }>
    platforms: Array<{ id: string; name: string }>
    expenseTypes: Array<{ id: string; name: string }>
    paymentMethods: Array<{ id: string; name: string }>
  }
}

export function TransactionDrawer({
  transaction,
  open,
  onOpenChange,
  formData,
}: TransactionDrawerProps) {
  const t = useScopedI18n("dashboard.table")
  const [copied, setCopied] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const form = useForm({
    defaultValues: {
      amount: transaction?.amount || 0,
      date: transaction?.date || new Date(),
      driverId: transaction?.driverId || "",
      vehicleId: transaction?.vehicleId || "",
      expenseTypeIds: transaction?.expenseTypeIds || [],
      paymentMethodId: transaction?.paymentMethodId || "",
      platformIds: transaction?.platformIds || [],
      kmDriven: transaction?.kmDriven || undefined,
      hoursWorked: transaction?.hoursWorked || undefined,
    },
    onSubmit: async ({ value }) => {
      if (!transaction) return

      startTransition(async () => {
        try {
          if (transaction.type === "revenue") {
            await updateRevenue(transaction.id, {
              amount: value.amount,
              date: value.date,
              platformIds: value.platformIds.length > 0 ? value.platformIds : formData?.platforms.map(p => p.id) || [],
              driverId: value.driverId || undefined,
              vehicleId: value.vehicleId || undefined,
              paymentMethodId: value.paymentMethodId || undefined,
              kmDriven: value.kmDriven,
              hoursWorked: value.hoursWorked,
            })
          } else {
            await updateExpense(transaction.id, {
              amount: value.amount,
              date: value.date,
              expenseTypeIds: value.expenseTypeIds || [],
              driverId: value.driverId || undefined,
              vehicleId: value.vehicleId || undefined,
            })
          }

          toast.success("Transaction updated successfully")
          setIsEditing(false)
          onOpenChange(false)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to update transaction")
        }
      })
    },
  })

  React.useEffect(() => {
    if (transaction && open) {
      form.setFieldValue("amount", transaction.amount)
      form.setFieldValue("date", transaction.date)
      form.setFieldValue("driverId", transaction.driverId || "")
      form.setFieldValue("vehicleId", transaction.vehicleId || "")
      form.setFieldValue("expenseTypeIds", transaction.expenseTypeIds || [])
      form.setFieldValue("paymentMethodId", transaction.paymentMethodId || "")
      form.setFieldValue("platformIds", transaction.platformIds || [])
      form.setFieldValue("kmDriven", transaction.kmDriven || undefined)
      form.setFieldValue("hoursWorked", transaction.hoursWorked || undefined)
      setIsEditing(false)
    }
  }, [transaction, open])

  if (!transaction) return null

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const formatDateInput = (date: Date) => {
    return new Date(date).toISOString().slice(0, 16)
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DrawerTitle className="flex items-center gap-2">
                {isEditing ? "Edit Transaction" : t("transactionDetails")}
                <Badge
                  variant={transaction.type === "revenue" ? "default" : "secondary"}
                  className="font-medium"
                >
                  {transaction.type === "revenue" ? t("revenue") : t("expense")}
                </Badge>
              </DrawerTitle>
              <DrawerDescription className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                {formatDate(transaction.date)}
                <span className="text-muted-foreground">•</span>
                {formatTime(transaction.date)}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">{t("close")}</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <div className="overflow-y-auto p-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {t("amount")}
                    </div>
                    <span
                      className={`text-3xl font-bold tabular-nums ${transaction.type === "revenue"
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-600 dark:text-red-500"
                        }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    {t("category")}
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <p className="font-medium">{transaction.category}</p>
                  </div>
                </div>

                {transaction.description && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {t("description")}
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-sm">{transaction.description}</p>
                    </div>
                  </div>
                )}

                {(transaction.driver || transaction.vehicle || transaction.company) && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      Detalhes Adicionais
                    </div>
                    <div className="grid gap-3">
                      {transaction.driver && (
                        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{t("driver")}</p>
                            <p className="font-medium">{transaction.driver}</p>
                          </div>
                        </div>
                      )}

                      {transaction.vehicle && (
                        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{t("vehicle")}</p>
                            <p className="font-medium">{transaction.vehicle}</p>
                          </div>
                        </div>
                      )}

                      {transaction.company && (
                        <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{t("platform")}</p>
                            <p className="font-medium">{transaction.company}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <FieldSet>
                  <FieldGroup>
                    <form.Field name="amount">
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor="amount">{t("amount")}</FieldLabel>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                            required
                          />
                        </Field>
                      )}
                    </form.Field>
                    <form.Field name="date">
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor="date">{t("date")}</FieldLabel>
                          <Input
                            id="date"
                            type="datetime-local"
                            value={formatDateInput(field.state.value)}
                            onChange={(e) => field.handleChange(new Date(e.target.value))}
                            required
                          />
                        </Field>
                      )}
                    </form.Field>
                    {formData?.drivers && formData.drivers.length > 0 && (
                      <form.Field name="driverId">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="driverId">{t("driver")}</FieldLabel>
                            <Select
                              value={field.state.value}
                              onValueChange={field.handleChange}
                            >
                              <SelectTrigger id="driverId">
                                <SelectValue placeholder="Select driver" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {formData.drivers.map((driver) => (
                                  <SelectItem key={driver.id} value={driver.id}>
                                    {driver.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      </form.Field>
                    )}
                    {formData?.vehicles && formData.vehicles.length > 0 && (
                      <form.Field name="vehicleId">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="vehicleId">{t("vehicle")}</FieldLabel>
                            <Select
                              value={field.state.value}
                              onValueChange={field.handleChange}
                            >
                              <SelectTrigger id="vehicleId">
                                <SelectValue placeholder="Select vehicle" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {formData.vehicles.map((vehicle) => (
                                  <SelectItem key={vehicle.id} value={vehicle.id}>
                                    {vehicle.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      </form.Field>
                    )}

                    {transaction.type === "expense" && formData?.expenseTypes && (
                      <form.Field name="expenseTypeIds">
                        {(field) => (
                          <Field>
                            <FieldLabel>{t("category")}</FieldLabel>
                            <div className="space-y-2">
                              {formData.expenseTypes.map((type) => (
                                <div key={type.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`expenseType-${type.id}`}
                                    checked={field.state.value?.includes(type.id) || false}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const currentValue = field.state.value || [];
                                      if (checked) {
                                        field.handleChange([...currentValue, type.id]);
                                      } else {
                                        field.handleChange(currentValue.filter((id: string) => id !== type.id));
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`expenseType-${type.id}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {type.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Field>
                        )}
                      </form.Field>
                    )}

                    {transaction.type === "revenue" && formData?.paymentMethods && (
                      <form.Field name="paymentMethodId">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="paymentMethodId">Payment Method</FieldLabel>
                            <Select
                              value={field.state.value}
                              onValueChange={field.handleChange}
                            >
                              <SelectTrigger id="paymentMethodId">
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {formData.paymentMethods.map((method) => (
                                  <SelectItem key={method.id} value={method.id}>
                                    {method.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      </form.Field>
                    )}

                    {transaction.type === "revenue" && (
                      <form.Field name="kmDriven">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="kmDriven">KM Driven</FieldLabel>
                            <Input
                              id="kmDriven"
                              type="number"
                              step="0.1"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </Field>
                        )}
                      </form.Field>
                    )}

                    {transaction.type === "revenue" && (
                      <form.Field name="hoursWorked">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor="hoursWorked">Hours Worked</FieldLabel>
                            <Input
                              id="hoursWorked"
                              type="number"
                              step="0.1"
                              value={field.state.value || ""}
                              onChange={(e) => field.handleChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </Field>
                        )}
                      </form.Field>
                    )}
                  </FieldGroup>
                </FieldSet>
              </div>
            )}
          </div>

          <DrawerFooter className="border-t">
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    className="flex-1"
                    variant="default"
                    onClick={() => setIsEditing(true)}
                    type="button"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onOpenChange(false)}
                    type="button"
                  >
                    {t("close")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="flex-1"
                    variant="default"
                    type="submit"
                    disabled={isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                    type="button"
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
