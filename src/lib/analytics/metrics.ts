export interface PeriodMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalKm: number;
  totalHours: number;
}

export interface MetricsComparison {
  current: PeriodMetrics;
  previous: PeriodMetrics;
  growth: {
    revenue: number;
    expenses: number;
    profit: number;
    km: number;
    hours: number;
  };
}

export interface EfficiencyMetrics {
  revenuePerKm: number;
  revenuePerHour: number;
  costPerKm: number;
  netProfitPerTrip: number;
  profitMargin: number;
}

export interface PaymentMethodFees {
  grossRevenue: number;
  totalFees: number;
  netRevenue: number;
  feePercentage: number;
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function calculateEfficiencyMetrics(
  totalRevenue: number,
  totalExpenses: number,
  totalKm: number,
  totalHours: number,
  revenueCount: number
): EfficiencyMetrics {
  const netProfit = totalRevenue - totalExpenses;

  return {
    revenuePerKm: totalKm > 0 ? totalRevenue / totalKm : 0,
    revenuePerHour: totalHours > 0 ? totalRevenue / totalHours : 0,
    costPerKm: totalKm > 0 ? totalExpenses / totalKm : 0,
    netProfitPerTrip: revenueCount > 0 ? netProfit / revenueCount : 0,
    profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
  };
}

export function calculatePaymentFees(
  revenues: Array<{
    amount: number;
    paymentMethod: {
      feePercentage: number | null;
      feeFixed: number | null;
    } | null;
  }>
): PaymentMethodFees {
  let grossRevenue = 0;
  let totalFees = 0;

  for (const revenue of revenues) {
    grossRevenue += revenue.amount;

    if (revenue.paymentMethod) {
      const percentageFee = revenue.paymentMethod.feePercentage
        ? (revenue.amount * revenue.paymentMethod.feePercentage) / 100
        : 0;
      const fixedFee = revenue.paymentMethod.feeFixed || 0;
      totalFees += percentageFee + fixedFee;
    }
  }

  const netRevenue = grossRevenue - totalFees;
  const feePercentage = grossRevenue > 0 ? (totalFees / grossRevenue) * 100 : 0;

  return {
    grossRevenue,
    totalFees,
    netRevenue,
    feePercentage,
  };
}
