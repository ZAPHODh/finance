"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useScopedI18n } from "@/locales/client";
import type { PlanType } from "@prisma/client";

interface ExpenseType {
  id: string;
  name: string;
}

interface Driver {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  name: string;
}

interface IndividualExpense {
  id: string;
  amount: number;
  expenseTypeId: string;
}

interface ExpenseSectionProps {
  // Data
  expenseTypes: ExpenseType[];
  drivers?: Driver[];
  vehicles?: Vehicle[];

  // Plan configuration
  planType: PlanType;
  canSelectDriver: boolean;
  canSelectVehicle: boolean;

  // Defaults for FREE plan
  defaultDriver?: { id: string; name: string } | null;
  defaultVehicle?: { id: string; name: string } | null;
  defaultDriverId?: string | null;
  defaultVehicleId?: string | null;

  // Controlled state
  mode: "sum" | "individual" | "none";
  onModeChange: (mode: "sum" | "individual" | "none") => void;

  // Sum mode
  totalExpense: number | undefined;
  onTotalExpenseChange: (value: number | undefined) => void;
  selectedExpenseTypes: string[];
  onSelectedExpenseTypesChange: (types: string[]) => void;

  // Individual mode
  expenses: IndividualExpense[];
  onExpensesChange: (expenses: IndividualExpense[]) => void;

  // Shared fields
  driverId: string | undefined;
  onDriverChange: (id: string | undefined) => void;
  vehicleId: string | undefined;
  onVehicleChange: (id: string | undefined) => void;
}

export function ExpenseSection({
  expenseTypes,
  drivers = [],
  vehicles = [],
  planType,
  canSelectDriver,
  canSelectVehicle,
  defaultDriver,
  defaultVehicle,
  defaultDriverId,
  defaultVehicleId,
  mode,
  onModeChange,
  totalExpense,
  onTotalExpenseChange,
  selectedExpenseTypes,
  onSelectedExpenseTypesChange,
  expenses,
  onExpensesChange,
  driverId,
  onDriverChange,
  vehicleId,
  onVehicleChange,
}: ExpenseSectionProps) {
  const t = useScopedI18n("financial.dailyEntry");

  function handleExpenseTypeToggle(typeId: string) {
    if (selectedExpenseTypes.includes(typeId)) {
      onSelectedExpenseTypesChange(selectedExpenseTypes.filter(id => id !== typeId));
    } else {
      onSelectedExpenseTypesChange([...selectedExpenseTypes, typeId]);
    }
  }

  function addExpense() {
    const newExpense: IndividualExpense = {
      id: Math.random().toString(36).substr(2, 9),
      amount: 0,
      expenseTypeId: expenseTypes[0]?.id || "",
    };
    onExpensesChange([...expenses, newExpense]);
  }

  function updateExpense(id: string, updates: Partial<IndividualExpense>) {
    onExpensesChange(
      expenses.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      )
    );
  }

  function removeExpense(id: string) {
    onExpensesChange(expenses.filter(exp => exp.id !== id));
  }

  const isFree = planType === "FREE";

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t("expenseSection")}</h3>

        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value) onModeChange(value as "sum" | "individual");
          }}
          className="border rounded-md"
        >
          <ToggleGroupItem value="sum" className="text-xs">
            {t("sumMode")}
          </ToggleGroupItem>
          <ToggleGroupItem value="individual" className="text-xs">
            {t("individualMode")}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {mode === "none" && (
        <p className="text-sm text-muted-foreground">
          Selecione um modo acima para adicionar despesa
        </p>
      )}

      {/* SUM MODE */}
      {mode === "sum" && (
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="totalExpense">{t("totalExpense")}</FieldLabel>
            <Input
              id="totalExpense"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={totalExpense ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                onTotalExpenseChange(value ? parseFloat(value) : undefined);
              }}
            />
          </Field>
        </div>
      )}

      {/* INDIVIDUAL MODE */}
      {mode === "individual" && (
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma despesa adicionada ainda
            </p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense, index) => (
                <div key={expense.id} className="flex items-end gap-2">
                  <Field className="flex-1">
                    {index === 0 && <FieldLabel>Valor</FieldLabel>}
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={expense.amount || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateExpense(expense.id, {
                          amount: value ? parseFloat(value) : 0
                        });
                      }}
                    />
                  </Field>

                  <Field className="flex-1">
                    {index === 0 && <FieldLabel>Tipo</FieldLabel>}
                    <Select
                      value={expense.expenseTypeId}
                      onValueChange={(value) =>
                        updateExpense(expense.id, { expenseTypeId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExpense(expense.id)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExpense}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("addExpense")}
          </Button>

          {expenses.length > 0 && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">
                Total: R$ {expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SHARED FIELDS (shown only when mode is not "none") */}
      {mode !== "none" && (
        <div className="space-y-4 border-t pt-4">
          {/* Expense Types */}
          {expenseTypes.length > 0 && (
            <Field>
              <FieldLabel>{t("selectExpenseTypes")}</FieldLabel>
              <div className="space-y-2 rounded-md border p-3">
                {expenseTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`expenseType-${type.id}`}
                      checked={selectedExpenseTypes.includes(type.id)}
                      onCheckedChange={() => handleExpenseTypeToggle(type.id)}
                    />
                    <label
                      htmlFor={`expenseType-${type.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </Field>
          )}

          {/* Driver */}
          {isFree && defaultDriver ? (
            <Field>
              <FieldLabel>{t("driver")}</FieldLabel>
              <Input
                value={defaultDriver.name}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                {t("readonlyField")}
              </p>
            </Field>
          ) : canSelectDriver && drivers.length > 0 && (
            <Field>
              <FieldLabel htmlFor="expenseDriver">{t("driver")}</FieldLabel>
              <Select
                value={driverId || defaultDriverId || "none"}
                onValueChange={(value) =>
                  onDriverChange(value === "none" ? undefined : value)
                }
              >
                <SelectTrigger id="expenseDriver">
                  <SelectValue placeholder={t("driver")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          {/* Vehicle */}
          {isFree && defaultVehicle ? (
            <Field>
              <FieldLabel>{t("vehicle")}</FieldLabel>
              <Input
                value={defaultVehicle.name}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                {t("readonlyField")}
              </p>
            </Field>
          ) : canSelectVehicle && vehicles.length > 0 && (
            <Field>
              <FieldLabel htmlFor="expenseVehicle">{t("vehicle")}</FieldLabel>
              <Select
                value={vehicleId || defaultVehicleId || "none"}
                onValueChange={(value) =>
                  onVehicleChange(value === "none" ? undefined : value)
                }
              >
                <SelectTrigger id="expenseVehicle">
                  <SelectValue placeholder={t("vehicle")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </div>
      )}
    </div>
  );
}
