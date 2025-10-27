import type { ReportType, PartnerCategory, Partner } from '@prisma/client';

// Available report types with metadata
export const AVAILABLE_REPORTS = [
  {
    id: 'monthly-summary',
    type: 'MONTHLY_SUMMARY' as ReportType,
    name: 'Resumo Mensal',
    description: 'Visão completa do mês com receitas, despesas e lucro líquido',
    icon: '📊',
    filters: ['period', 'driver', 'vehicle'] as const,
    partnerCategory: null,
  },
  {
    id: 'expense-breakdown',
    type: 'EXPENSE_BREAKDOWN' as ReportType,
    name: 'Detalhamento de Despesas',
    description: 'Análise detalhada de todas as despesas por tipo e categoria',
    icon: '💰',
    filters: ['period', 'driver', 'vehicle', 'expenseType'] as const,
    partnerCategory: 'FUEL' as PartnerCategory, // Para marketing contextual
  },
  {
    id: 'revenue-breakdown',
    type: 'REVENUE_BREAKDOWN' as ReportType,
    name: 'Detalhamento de Receitas',
    description: 'Análise de receitas por plataforma e motorista',
    icon: '💵',
    filters: ['period', 'driver', 'vehicle', 'platform'] as const,
    partnerCategory: null,
  },
  {
    id: 'dre',
    type: 'DRE' as ReportType,
    name: 'DRE Simplificado',
    description: 'Demonstração do Resultado do Exercício',
    icon: '📈',
    filters: ['period'] as const,
    partnerCategory: 'PAYMENT' as PartnerCategory,
  },
  {
    id: 'driver-performance',
    type: 'DRIVER_PERFORMANCE' as ReportType,
    name: 'Performance por Motorista',
    description: 'Métricas individuais de performance e resultados financeiros',
    icon: '👤',
    filters: ['period', 'driver'] as const,
    partnerCategory: 'MAINTENANCE' as PartnerCategory,
  },
  {
    id: 'vehicle-performance',
    type: 'VEHICLE_PERFORMANCE' as ReportType,
    name: 'Performance por Veículo',
    description: 'Métricas de eficiência e custos por veículo',
    icon: '🚗',
    filters: ['period', 'vehicle'] as const,
    partnerCategory: 'MAINTENANCE' as PartnerCategory,
  },
] as const;

export type AvailableReport = typeof AVAILABLE_REPORTS[number];

// Report filters
export interface ReportFilters {
  startDate: string;
  endDate: string;
  driverId?: string;
  vehicleId?: string;
  platformId?: string;
  expenseTypeId?: string;
}

// Report data structures
export interface ReportData {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
  };
  expenses?: ExpenseData[];
  revenues?: RevenueData[];
  drivers?: DriverPerformance[];
  vehicles?: VehiclePerformance[];
}

export interface ExpenseData {
  id: string;
  date: Date;
  amount: number;
  expenseType: { name: string };
  driver?: { name: string };
  vehicle?: { name: string };
  paymentMethod?: { name: string };
}

export interface RevenueData {
  id: string;
  date: Date;
  amount: number;
  platforms: { platform: { name: string } }[];
  driver?: { name: string };
  vehicle?: { name: string };
}

export interface DriverPerformance {
  id: string;
  name: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  trips: number;
  avgRevenuePerTrip: number;
}

export interface VehiclePerformance {
  id: string;
  name: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  kmDriven: number;
  costPerKm: number;
}

// Partner recommendation
export interface PartnerRecommendation {
  partner: Partner;
  potentialSavings: number;
  message: string;
  placement: 'header' | 'footer' | 'sidebar' | 'callout';
}

// Export formats
export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface ExportOptions {
  format: ExportFormat;
  includeCharts?: boolean;
  includeMarketing?: boolean;
}
