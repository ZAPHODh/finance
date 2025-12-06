import { z } from 'zod';

const currentYear = new Date().getFullYear();
const maxFutureYear = currentYear + 1;
const minVehicleYear = 1900;

export function createNameSchema(options?: {
  min?: number;
  max?: number;
  errorMessage?: string;
}) {
  const min = options?.min ?? 2;
  const max = options?.max ?? 100;

  return z
    .string()
    .min(min, options?.errorMessage || `Name must be at least ${min} characters`)
    .max(max, options?.errorMessage || `Name must be at most ${max} characters`)
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      options?.errorMessage || 'Name can only contain letters, spaces, hyphens, and apostrophes'
    );
}

export function createVehicleYearSchema(errorMessage?: string) {
  return z
    .number()
    .int()
    .min(minVehicleYear, errorMessage || `Year must be at least ${minVehicleYear}`)
    .max(maxFutureYear, errorMessage || `Year cannot be later than ${maxFutureYear}`);
}

export function createMonetaryAmountSchema(options?: {
  min?: number;
  max?: number;
  errorMessage?: string;
}) {
  const min = options?.min ?? 0.01;
  const max = options?.max ?? 1000000;

  return z
    .number()
    .min(min, options?.errorMessage || `Amount must be at least ${min}`)
    .max(max, options?.errorMessage || `Amount cannot exceed ${max}`);
}

export function createFutureDateSchema(maxDaysInFuture?: number, errorMessage?: string) {
  const maxDays = maxDaysInFuture ?? 365;

  return z.date().refine((date) => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDays);
    return date <= maxDate;
  }, errorMessage || `Date cannot be more than ${maxDays} days in the future`);
}

export function createKmDrivenSchema(errorMessage?: string) {
  return z
    .number()
    .min(0, errorMessage || 'Kilometers driven cannot be negative')
    .max(5000, errorMessage || 'Kilometers driven cannot exceed 5000 per day');
}

export function createHoursWorkedSchema(errorMessage?: string) {
  return z
    .number()
    .min(0, errorMessage || 'Hours worked cannot be negative')
    .max(24, errorMessage || 'Hours worked cannot exceed 24 per day');
}

export function createPercentageSchema(errorMessage?: string) {
  return z
    .number()
    .min(0, errorMessage || 'Percentage must be at least 0')
    .max(100, errorMessage || 'Percentage cannot exceed 100');
}

export function createPeriodSchema(errorMessage?: string) {
  return z
    .string()
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])$/,
      errorMessage || 'Period must be in YYYY-MM format'
    );
}

export const nameSchema = createNameSchema();
export const vehicleYearSchema = createVehicleYearSchema();
export const monetaryAmountSchema = createMonetaryAmountSchema();
export const futureDateSchema = createFutureDateSchema();
export const kmDrivenSchema = createKmDrivenSchema();
export const hoursWorkedSchema = createHoursWorkedSchema();
export const percentageSchema = createPercentageSchema();
export const periodSchema = createPeriodSchema();
