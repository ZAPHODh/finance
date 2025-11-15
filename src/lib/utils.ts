import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { clsx, type ClassValue } from "clsx";
import { endOfDay, endOfMonth, endOfToday, endOfWeek, startOfDay, startOfMonth, startOfToday, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function getDateRange(period: string = "thisMonth") {
  const now = new Date()

  switch (period) {
    case "today":
      return {
        start: startOfToday(),
        end: endOfToday(),
      }
    case "thisWeek":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      }
    case "thisMonth":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
    case "last30Days":
      return {
        start: subDays(startOfToday(), 30),
        end: endOfToday(),
      }
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
  }
}

export function getPreviousDateRange(period: string = "thisMonth") {
  const now = new Date()

  switch (period) {
    case "today":
      const yesterday = subDays(now, 1)
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      }
    case "thisWeek":
      const lastWeek = subWeeks(now, 1)
      return {
        start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      }
    case "thisMonth":
      const lastMonth = subMonths(now, 1)
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      }
    case "last30Days":
      return {
        start: subDays(startOfToday(), 60),
        end: subDays(startOfToday(), 31),
      }
    default:
      const prevMonth = subMonths(now, 1)
      return {
        start: startOfMonth(prevMonth),
        end: endOfMonth(prevMonth),
      }
  }
}

export class FreePlanLimitError extends Error {
  constructor(message = "Upgrade your plan!") {
    super(message);
  }
}

export function isRedirectError(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.includes("NEXT_REDIRECT")
  );
}

const alphanumeric =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateId(length = 10): string {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };
  return generateRandomString(random, alphanumeric, length);
}