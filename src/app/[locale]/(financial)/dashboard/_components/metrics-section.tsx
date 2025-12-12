"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useScopedI18n } from "@/locales/client";

interface MetricsSectionProps {
  kmDriven: number | undefined;
  hoursWorked: number | undefined;
  onKmChange: (value: number | undefined) => void;
  onHoursChange: (value: number | undefined) => void;
  disabled?: boolean;
}

export function MetricsSection({
  kmDriven,
  hoursWorked,
  onKmChange,
  onHoursChange,
  disabled = false,
}: MetricsSectionProps) {
  const t = useScopedI18n("financial.dailyEntry");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{t("metricsSection")}</h3>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="kmDriven">{t("kmDriven")}</FieldLabel>
          <Input
            id="kmDriven"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={kmDriven ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              onKmChange(value ? parseFloat(value) : undefined);
            }}
            disabled={disabled}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="hoursWorked">{t("hoursWorked")}</FieldLabel>
          <Input
            id="hoursWorked"
            type="number"
            step="0.5"
            min="0"
            placeholder="0.0"
            value={hoursWorked ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              onHoursChange(value ? parseFloat(value) : undefined);
            }}
            disabled={disabled}
          />
        </Field>
      </div>

      <p className="text-xs text-muted-foreground">
        {t("metricsSection")} são opcionais e aplicam-se a todo o dia
      </p>
    </div>
  );
}
