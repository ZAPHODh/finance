import { z } from "zod";

export const dailyEntrySchema = z.object({
  date: z.date(),

  // Revenue configuration
  revenueMode: z.enum(["sum", "individual", "none"]).default("none"),

  // Sum mode revenue
  totalRevenue: z.number().optional(),
  platformIds: z.array(z.string()).optional(),

  // Individual mode revenues
  revenues: z.array(z.object({
    amount: z.number().positive(),
    platformId: z.string(),
  })).optional(),

  // Shared revenue fields
  paymentMethodId: z.string().optional(),

  // Expense configuration
  expenseMode: z.enum(["sum", "individual", "none"]).default("none"),

  // Sum mode expense
  totalExpense: z.number().optional(),
  expenseTypeIds: z.array(z.string()).optional(),

  // Individual mode expenses
  expenses: z.array(z.object({
    amount: z.number().positive(),
    expenseTypeId: z.string(),
  })).optional(),

  // Metrics (shared across all modes)
  kmDriven: z.number().optional(),
  hoursWorked: z.number().optional(),

  // Driver/Vehicle (will be overridden for FREE users)
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
}).refine(
  data => {
    const hasRevenue = data.revenueMode !== "none" && (
      (data.revenueMode === "sum" && data.totalRevenue && data.totalRevenue > 0) ||
      (data.revenueMode === "individual" && data.revenues && data.revenues.length > 0)
    );

    const hasExpense = data.expenseMode !== "none" && (
      (data.expenseMode === "sum" && data.totalExpense && data.totalExpense > 0) ||
      (data.expenseMode === "individual" && data.expenses && data.expenses.length > 0)
    );

    return hasRevenue || hasExpense;
  },
  { message: "At least one revenue or expense must be provided" }
).refine(
  data => {
    if (data.revenueMode === "sum" && data.totalRevenue && data.totalRevenue > 0) {
      return data.platformIds && data.platformIds.length > 0;
    }
    return true;
  },
  { message: "At least one platform must be selected for revenue" }
).refine(
  data => {
    if (data.expenseMode === "sum" && data.totalExpense && data.totalExpense > 0) {
      return data.expenseTypeIds && data.expenseTypeIds.length > 0;
    }
    return true;
  },
  { message: "At least one expense type must be selected for expense" }
);

export type DailyEntryInput = z.infer<typeof dailyEntrySchema>;
