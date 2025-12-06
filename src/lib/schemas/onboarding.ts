import { z } from "zod";
import { createNameSchema, createVehicleYearSchema } from "@/lib/validations/common";
import { createBrazilianPlateSchema, createCPFSchema, createCNHSchema, createBrazilianPhoneSchema } from "@/lib/validations/brazilian";

export const driverSchema = z.object({
  name: createNameSchema({ errorMessage: "Driver name is required" }),
  isSelf: z.boolean().optional(),
  cpf: createCPFSchema().optional(),
  cnh: createCNHSchema().optional(),
  phone: createBrazilianPhoneSchema().optional(),
});

export const vehicleSchema = z.object({
  name: z.string().min(1, "Vehicle name is required"),
  plate: createBrazilianPlateSchema().optional(),
  model: z.string().optional(),
  year: createVehicleYearSchema().optional(),
  isPrimary: z.boolean().optional(),
});

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

export const onboardingSchema = z.object({
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  drivers: z.array(driverSchema).min(1, "At least one driver is required"),
  vehicles: z.array(vehicleSchema).min(1, "At least one vehicle is required"),
  expenseTypes: z.array(z.string()),
  paymentMethods: z.array(z.string()),
  accessibility: accessibilitySchema.optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type Driver = z.infer<typeof driverSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
export type AccessibilityFormData = z.infer<typeof accessibilitySchema>;
