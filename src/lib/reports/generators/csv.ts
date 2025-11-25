import Papa from 'papaparse';
import type { ReportData } from '../types';
import type { ReportType } from '@prisma/client';

/**
 * Gera um arquivo CSV a partir dos dados do relatório
 * @param reportType Tipo do relatório
 * @param reportData Dados do relatório
 * @returns Buffer do arquivo CSV
 */
export async function generateCSV(
  reportType: ReportType,
  reportData: ReportData
): Promise<Buffer> {
  let csvContent = '';

  switch (reportType) {
    case 'EXPENSE_BREAKDOWN':
      csvContent = generateExpenseBreakdownCSV(reportData);
      break;

    case 'REVENUE_BREAKDOWN':
      csvContent = generateRevenueBreakdownCSV(reportData);
      break;

    case 'MONTHLY_SUMMARY':
      csvContent = generateMonthlySummaryCSV(reportData);
      break;

    case 'DRIVER_PERFORMANCE':
      csvContent = generateDriverPerformanceCSV(reportData);
      break;

    case 'VEHICLE_PERFORMANCE':
      csvContent = generateVehiclePerformanceCSV(reportData);
      break;

    case 'DRE':
      csvContent = generateDRECSV(reportData);
      break;

    default:
      throw new Error(`Report type ${reportType} not implemented`);
  }

  return Buffer.from(csvContent, 'utf-8');
}

function generateExpenseBreakdownCSV(reportData: ReportData): string {
  if (!reportData.expenses) return '';

  const rows = reportData.expenses.map(expense => ({
    Data: new Date(expense.date).toLocaleDateString('pt-BR'),
    'Tipo de Despesa': expense.expenseType.name,
    Motorista: expense.driver?.name || '-',
    Veículo: expense.vehicle?.name || '-',
    'Forma de Pagamento': expense.paymentMethod?.name || '-',
    Valor: expense.amount.toFixed(2),
  }));

  rows.push({
    Data: '',
    'Tipo de Despesa': 'TOTAL',
    Motorista: '',
    Veículo: '',
    'Forma de Pagamento': '',
    Valor: reportData.summary.totalExpenses.toFixed(2),
  });

  return Papa.unparse(rows, {
    delimiter: ',',
    header: true,
  });
}

function generateRevenueBreakdownCSV(reportData: ReportData): string {
  if (!reportData.revenues) return '';

  const rows = reportData.revenues.map(revenue => ({
    Data: new Date(revenue.date).toLocaleDateString('pt-BR'),
    Plataformas: revenue.platforms.map(p => p.platform.name).join(', '),
    Motorista: revenue.driver?.name || '-',
    Veículo: revenue.vehicle?.name || '-',
    Valor: revenue.amount.toFixed(2),
  }));

  rows.push({
    Data: '',
    Plataformas: 'TOTAL',
    Motorista: '',
    Veículo: '',
    Valor: reportData.summary.totalRevenue.toFixed(2),
  });

  return Papa.unparse(rows, {
    delimiter: ',',
    header: true,
  });
}

function generateMonthlySummaryCSV(reportData: ReportData): string {
  const summaryRows = [
    { Métrica: 'Receita Total', Valor: reportData.summary.totalRevenue.toFixed(2) },
    { Métrica: 'Despesas Totais', Valor: reportData.summary.totalExpenses.toFixed(2) },
    { Métrica: 'Lucro Líquido', Valor: reportData.summary.netProfit.toFixed(2) },
    { Métrica: 'Margem de Lucro (%)', Valor: reportData.summary.profitMargin.toFixed(2) },
  ];

  let csv = Papa.unparse(summaryRows, { delimiter: ',', header: true });

  if (reportData.expenses && reportData.expenses.length > 0) {
    csv += '\n\n';
    csv += generateExpenseBreakdownCSV(reportData);
  }

  if (reportData.revenues && reportData.revenues.length > 0) {
    csv += '\n\n';
    csv += generateRevenueBreakdownCSV(reportData);
  }

  return csv;
}

function generateDriverPerformanceCSV(reportData: ReportData): string {
  if (!reportData.drivers) return '';

  const rows = reportData.drivers.map(driver => ({
    Motorista: driver.name,
    'Receita Total': driver.totalRevenue.toFixed(2),
    'Despesas Totais': driver.totalExpenses.toFixed(2),
    'Lucro Líquido': driver.netProfit.toFixed(2),
    'Nº de Corridas': driver.trips,
    'Receita Média/Corrida': driver.avgRevenuePerTrip.toFixed(2),
  }));

  return Papa.unparse(rows, {
    delimiter: ',',
    header: true,
  });
}

function generateVehiclePerformanceCSV(reportData: ReportData): string {
  if (!reportData.vehicles) return '';

  const rows = reportData.vehicles.map(vehicle => ({
    Veículo: vehicle.name,
    'Receita Total': vehicle.totalRevenue.toFixed(2),
    'Despesas Totais': vehicle.totalExpenses.toFixed(2),
    'Lucro Líquido': vehicle.netProfit.toFixed(2),
    'KM Rodados': vehicle.kmDriven.toFixed(2),
    'Custo por KM': vehicle.costPerKm.toFixed(2),
  }));

  return Papa.unparse(rows, {
    delimiter: ',',
    header: true,
  });
}

function generateDRECSV(reportData: ReportData): string {
  const dreRows = [
    { Conta: 'RECEITA BRUTA', Valor: reportData.summary.totalRevenue.toFixed(2) },
    { Conta: '(-) DESPESAS OPERACIONAIS', Valor: reportData.summary.totalExpenses.toFixed(2) },
    { Conta: '= LUCRO LÍQUIDO', Valor: reportData.summary.netProfit.toFixed(2) },
    { Conta: 'MARGEM LÍQUIDA (%)', Valor: reportData.summary.profitMargin.toFixed(2) },
  ];

  return Papa.unparse(dreRows, {
    delimiter: ',',
    header: true,
  });
}
