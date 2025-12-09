import { z } from "zod";
import { createNameSchema, createVehicleYearSchema } from "@/lib/validations/common";
import { createBrazilianPlateSchema, createCPFSchema, createCNHSchema, createBrazilianPhoneSchema } from "@/lib/validations/brazilian";

export function createDriverSchema(errorMessages: { nameRequired: string }) {
  return z.object({
    name: createNameSchema({ errorMessage: errorMessages.nameRequired }),
    isSelf: z.boolean().optional(),
    cpf: createCPFSchema().optional(),
    cnh: createCNHSchema().optional(),
    phone: createBrazilianPhoneSchema().optional(),
  });
}

export function createVehicleSchema(errorMessages: { nameRequired: string }) {
  return z.object({
    name: z.string().min(1, errorMessages.nameRequired),
    plate: createBrazilianPlateSchema().optional(),
    model: z.string().optional(),
    year: createVehicleYearSchema().optional(),
    isPrimary: z.boolean().optional(),
  });
}

export const driverSchema = createDriverSchema({ nameRequired: "Driver name is required" });
export const vehicleSchema = createVehicleSchema({ nameRequired: "Vehicle name is required" });

export const keyboardShortcutSchema = z.object({
  key: z.string(),
  ctrl: z.boolean().optional(),
  shift: z.boolean().optional(),
  alt: z.boolean().optional(),
  meta: z.boolean().optional(),
});

export const accessibilitySchema = z.object({
  keyboardShortcuts: z.object({
    newDailyEntry: keyboardShortcutSchema,
    newRevenue: keyboardShortcutSchema,
    newExpense: keyboardShortcutSchema,
    repeatLast: keyboardShortcutSchema,
  }),
  theme: z.enum(["light", "dark", "system"]),
  fontSize: z.enum(["small", "medium", "large", "x-large"]),
  fontFamily: z.enum(["default", "dyslexic", "mono"]),
  lineSpacing: z.enum(["normal", "relaxed", "loose"]),
  reducedMotion: z.boolean(),
  highContrast: z.boolean(),
});

export function createOnboardingSchema(errorMessages: {
  platformsRequired: string;
  driversRequired: string;
  vehiclesRequired: string;
  driverNameRequired: string;
  vehicleNameRequired: string;
}) {
  return z.object({
    platforms: z.array(z.string()).min(1, errorMessages.platformsRequired),
    drivers: z.array(createDriverSchema({ nameRequired: errorMessages.driverNameRequired })).min(1, errorMessages.driversRequired),
    vehicles: z.array(createVehicleSchema({ nameRequired: errorMessages.vehicleNameRequired })).min(1, errorMessages.vehiclesRequired),
    expenseTypes: z.array(z.string()),
    paymentMethods: z.array(z.string()),
    accessibility: accessibilitySchema.optional(),
  });
}

export const onboardingSchema = createOnboardingSchema({
  platformsRequired: "At least one platform is required",
  driversRequired: "At least one driver is required",
  vehiclesRequired: "At least one vehicle is required",
  driverNameRequired: "Driver name is required",
  vehicleNameRequired: "Vehicle name is required",
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type Driver = z.infer<typeof driverSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
export type AccessibilityFormData = z.infer<typeof accessibilitySchema>;
