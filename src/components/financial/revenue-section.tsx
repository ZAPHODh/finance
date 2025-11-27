"use client";

import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useScopedI18n } from "@/locales/client";
import type { PlanType } from "@prisma/client";

interface Platform {
  id: string;
  name: string;
}

interface PaymentMethod {
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

interface IndividualRevenue {
  id: string;
  amount: number;
  platformId: string;
}

interface RevenueSectionProps {
  // Data
  platforms: Platform[];
  paymentMethods?: PaymentMethod[];
  drivers?: Driver[];
  vehicles?: Vehicle[];

  // Plan configuration
  planType: PlanType;
  canSelectDriver: boolean;
  canSelectVehicle: boolean;
  canSelectPaymentMethod: boolean;

  // Defaults for FREE plan
  defaultDriver?: { id: string; name: string } | null;
  defaultVehicle?: { id: string; name: string } | null;
  defaultDriverId?: string | null;
  defaultVehicleId?: string | null;
  mostUsedPlatforms?: string[];

  // Controlled state
  mode: "sum" | "individual" | "none";
  onModeChange: (mode: "sum" | "individual" | "none") => void;

  // Sum mode
  totalRevenue: number | undefined;
  onTotalRevenueChange: (value: number | undefined) => void;
  selectedPlatforms: string[];
  onSelectedPlatformsChange: (platforms: string[]) => void;

  // Individual mode
  revenues: IndividualRevenue[];
  onRevenuesChange: (revenues: IndividualRevenue[]) => void;

  // Shared fields
  paymentMethodId: string | undefined;
  onPaymentMethodChange: (id: string | undefined) => void;
  driverId: string | undefined;
  onDriverChange: (id: string | undefined) => void;
  vehicleId: string | undefined;
  onVehicleChange: (id: string | undefined) => void;
}

export function RevenueSection({
  platforms,
  paymentMethods = [],
  drivers = [],
  vehicles = [],
  planType,
  canSelectDriver,
  canSelectVehicle,
  canSelectPaymentMethod,
  defaultDriver,
  defaultVehicle,
  defaultDriverId,
  defaultVehicleId,
  mostUsedPlatforms = [],
  mode,
  onModeChange,
  totalRevenue,
  onTotalRevenueChange,
  selectedPlatforms,
  onSelectedPlatformsChange,
  revenues,
  onRevenuesChange,
  paymentMethodId,
  onPaymentMethodChange,
  driverId,
  onDriverChange,
  vehicleId,
  onVehicleChange,
}: RevenueSectionProps) {
  const t = useScopedI18n("financial.dailyEntry");
  const tRevenues = useScopedI18n("financial.revenues");

  function handlePlatformToggle(platformId: string) {
    if (selectedPlatforms.includes(platformId)) {
      onSelectedPlatformsChange(selectedPlatforms.filter(id => id !== platformId));
    } else {
      onSelectedPlatformsChange([...selectedPlatforms, platformId]);
    }
  }

  function addRevenue() {
    const newRevenue: IndividualRevenue = {
      id: Math.random().toString(36).substr(2, 9),
      amount: 0,
      platformId: platforms[0]?.id || "",
    };
    onRevenuesChange([...revenues, newRevenue]);
  }

  function updateRevenue(id: string, updates: Partial<IndividualRevenue>) {
    onRevenuesChange(
      revenues.map(rev =>
        rev.id === id ? { ...rev, ...updates } : rev
      )
    );
  }

  function removeRevenue(id: string) {
    onRevenuesChange(revenues.filter(rev => rev.id !== id));
  }

  const isFree = planType === "FREE";

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{t("revenueSection")}</h3>

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
          Selecione um modo acima para adicionar receita
        </p>
      )}

      {/* SUM MODE */}
      {mode === "sum" && (
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="totalRevenue">{t("totalRevenue")}</FieldLabel>
            <Input
              id="totalRevenue"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={totalRevenue ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                onTotalRevenueChange(value ? parseFloat(value) : undefined);
              }}
            />
          </Field>

          <Field>
            <FieldLabel>{t("selectPlatforms")}</FieldLabel>
            <div className="space-y-2 rounded-md border p-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform.id}`}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                  />
                  <label
                    htmlFor={`platform-${platform.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {platform.name}
                  </label>
                </div>
              ))}
            </div>
          </Field>
        </div>
      )}

      {/* INDIVIDUAL MODE */}
      {mode === "individual" && (
        <div className="space-y-4">
          {revenues.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma receita adicionada ainda
            </p>
          ) : (
            <div className="space-y-3">
              {revenues.map((revenue, index) => (
                <div key={revenue.id} className="flex items-end gap-2">
                  <Field className="flex-1">
                    {index === 0 && <FieldLabel>Valor</FieldLabel>}
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={revenue.amount || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateRevenue(revenue.id, {
                          amount: value ? parseFloat(value) : 0
                        });
                      }}
                    />
                  </Field>

                  <Field className="flex-1">
                    {index === 0 && <FieldLabel>Plataforma</FieldLabel>}
                    <Select
                      value={revenue.platformId}
                      onValueChange={(value) =>
                        updateRevenue(revenue.id, { platformId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            {platform.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRevenue(revenue.id)}
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
            onClick={addRevenue}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("addRevenue")}
          </Button>

          {revenues.length > 0 && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">
                Total: R$ {revenues.reduce((sum, rev) => sum + (rev.amount || 0), 0).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SHARED FIELDS (shown only when mode is not "none") */}
      {mode !== "none" && (
        <div className="space-y-4 border-t pt-4">
          {/* Payment Method (SIMPLE/PRO only) */}
          {canSelectPaymentMethod && paymentMethods.length > 0 && (
            <Field>
              <FieldLabel htmlFor="paymentMethod">
                {tRevenues("paymentMethod")}
              </FieldLabel>
              <Select
                value={paymentMethodId || "none"}
                onValueChange={(value) =>
                  onPaymentMethodChange(value === "none" ? undefined : value)
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder={tRevenues("paymentMethod")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <FieldLabel htmlFor="driver">{t("driver")}</FieldLabel>
              <Select
                value={driverId || defaultDriverId || "none"}
                onValueChange={(value) =>
                  onDriverChange(value === "none" ? undefined : value)
                }
              >
                <SelectTrigger id="driver">
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
              <FieldLabel htmlFor="vehicle">{t("vehicle")}</FieldLabel>
              <Select
                value={vehicleId || defaultVehicleId || "none"}
                onValueChange={(value) =>
                  onVehicleChange(value === "none" ? undefined : value)
                }
              >
                <SelectTrigger id="vehicle">
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
