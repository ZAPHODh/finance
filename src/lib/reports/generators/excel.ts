import ExcelJS from 'exceljs';
import type { ReportData } from '../types';
import type { ReportType } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Gera um arquivo Excel (.xlsx) a partir dos dados do relatório
 */
export async function generateExcel(
  reportType: ReportType,
  reportData: ReportData
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Financial App';
  workbook.created = new Date();

  // Adicionar worksheet principal
  const worksheet = workbook.addWorksheet('Relatório');

  // Configurar larguras das colunas
  worksheet.columns = [
    { width: 15 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 15 },
  ];

  let currentRow = 1;

  // Título
  const titleCell = worksheet.getCell(`A${currentRow}`);
  titleCell.value = getReportTitle(reportType);
  titleCell.font = { size: 18, bold: true };
  worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
  currentRow += 2;

  // Data de geração
  const dateCell = worksheet.getCell(`A${currentRow}`);
  dateCell.value = `Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`;
  dateCell.font = { size: 10, italic: true };
  worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
  currentRow += 2;

  // Resumo financeiro
  if (reportData.summary) {
    currentRow = addSummarySection(worksheet, reportData.summary, currentRow);
    currentRow += 2;
  }

  // Adicionar dados específicos baseado no tipo
  switch (reportType) {
    case 'EXPENSE_BREAKDOWN':
      if (reportData.expenses) {
        currentRow = addExpensesSheet(worksheet, reportData.expenses, currentRow);
      }
      break;

    case 'REVENUE_BREAKDOWN':
      if (reportData.revenues) {
        currentRow = addRevenuesSheet(worksheet, reportData.revenues, currentRow);
      }
      break;

    case 'MONTHLY_SUMMARY':
    case 'DRE':
      if (reportData.expenses && reportData.revenues) {
        currentRow = addExpensesSheet(worksheet, reportData.expenses, currentRow);
        currentRow += 2;
        currentRow = addRevenuesSheet(worksheet, reportData.revenues, currentRow);
      }
      break;

    case 'DRIVER_PERFORMANCE':
      if (reportData.drivers) {
        currentRow = addDriversSheet(worksheet, reportData.drivers, currentRow);
      }
      break;

    case 'VEHICLE_PERFORMANCE':
      if (reportData.vehicles) {
        currentRow = addVehiclesSheet(worksheet, reportData.vehicles, currentRow);
      }
      break;
  }

  // Gerar buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

function getReportTitle(reportType: ReportType): string {
  const titles: Record<ReportType, string> = {
    MONTHLY_SUMMARY: 'Resumo Mensal',
    DRE: 'DRE Simplificado',
    CARNE_LEAO: 'Relatório Carnê-Leão',
    EXPENSE_BREAKDOWN: 'Detalhamento de Despesas',
    REVENUE_BREAKDOWN: 'Detalhamento de Receitas',
    DRIVER_PERFORMANCE: 'Performance por Motorista',
    VEHICLE_PERFORMANCE: 'Performance por Veículo',
    CUSTOM: 'Relatório Personalizado',
  };
  return titles[reportType];
}

function addSummarySection(
  worksheet: ExcelJS.Worksheet,
  summary: ReportData['summary'],
  startRow: number
): number {
  let row = startRow;

  // Cabeçalho da seção
  const headerCell = worksheet.getCell(`A${row}`);
  headerCell.value = 'RESUMO FINANCEIRO';
  headerCell.font = { size: 14, bold: true };
  headerCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE5E7EB' },
  };
  worksheet.mergeCells(`A${row}:B${row}`);
  row++;

  // Receita Total
  worksheet.getCell(`A${row}`).value = 'Receita Total:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = summary.totalRevenue;
  worksheet.getCell(`B${row}`).numFmt = 'R$ #,##0.00';
  worksheet.getCell(`B${row}`).font = { color: { argb: 'FF22C55E' }, bold: true };
  row++;

  // Despesas Total
  worksheet.getCell(`A${row}`).value = 'Despesas Total:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = summary.totalExpenses;
  worksheet.getCell(`B${row}`).numFmt = 'R$ #,##0.00';
  worksheet.getCell(`B${row}`).font = { color: { argb: 'FFEF4444' }, bold: true };
  row++;

  // Lucro Líquido
  worksheet.getCell(`A${row}`).value = 'Lucro Líquido:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = summary.netProfit;
  worksheet.getCell(`B${row}`).numFmt = 'R$ #,##0.00';
  worksheet.getCell(`B${row}`).font = {
    color: { argb: summary.netProfit >= 0 ? 'FF22C55E' : 'FFEF4444' },
    bold: true,
  };
  row++;

  // Margem de Lucro
  worksheet.getCell(`A${row}`).value = 'Margem de Lucro:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = summary.profitMargin / 100;
  worksheet.getCell(`B${row}`).numFmt = '0.00%';
  worksheet.getCell(`B${row}`).font = { bold: true };
  row++;

  return row;
}

function addExpensesSheet(
  worksheet: ExcelJS.Worksheet,
  expenses: ReportData['expenses'],
  startRow: number
): number {
  if (!expenses || expenses.length === 0) {
    return startRow;
  }

  let row = startRow;

  // Cabeçalho
  const headerCell = worksheet.getCell(`A${row}`);
  headerCell.value = 'DESPESAS';
  headerCell.font = { size: 12, bold: true };
  worksheet.mergeCells(`A${row}:E${row}`);
  row++;

  // Cabeçalhos da tabela
  const headers = ['Data', 'Tipo', 'Motorista', 'Veículo', 'Valor'];
  headers.forEach((header, index) => {
    const cell = worksheet.getCell(row, index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' },
    };
    cell.alignment = { horizontal: 'center' };
  });
  row++;

  // Dados
  expenses.forEach((expense) => {
    worksheet.getCell(row, 1).value = format(new Date(expense.date), 'dd/MM/yyyy');
    worksheet.getCell(row, 2).value = expense.expenseType.name;
    worksheet.getCell(row, 3).value = expense.driver?.name || '-';
    worksheet.getCell(row, 4).value = expense.vehicle?.name || '-';
    worksheet.getCell(row, 5).value = expense.amount;
    worksheet.getCell(row, 5).numFmt = 'R$ #,##0.00';
    row++;
  });

  // Total
  worksheet.getCell(row, 4).value = 'Total:';
  worksheet.getCell(row, 4).font = { bold: true };
  worksheet.getCell(row, 4).alignment = { horizontal: 'right' };
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  worksheet.getCell(row, 5).value = totalExpenses;
  worksheet.getCell(row, 5).numFmt = 'R$ #,##0.00';
  worksheet.getCell(row, 5).font = { bold: true };
  worksheet.getCell(row, 5).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE5E7EB' },
  };
  row++;

  return row;
}

function addRevenuesSheet(
  worksheet: ExcelJS.Worksheet,
  revenues: ReportData['revenues'],
  startRow: number
): number {
  if (!revenues || revenues.length === 0) {
    return startRow;
  }

  let row = startRow;

  // Cabeçalho
  const headerCell = worksheet.getCell(`A${row}`);
  headerCell.value = 'RECEITAS';
  headerCell.font = { size: 12, bold: true };
  worksheet.mergeCells(`A${row}:E${row}`);
  row++;

  // Cabeçalhos da tabela
  const headers = ['Data', 'Plataformas', 'Motorista', 'Veículo', 'Valor'];
  headers.forEach((header, index) => {
    const cell = worksheet.getCell(row, index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF22C55E' },
    };
    cell.alignment = { horizontal: 'center' };
  });
  row++;

  // Dados
  revenues.forEach((revenue) => {
    worksheet.getCell(row, 1).value = format(new Date(revenue.date), 'dd/MM/yyyy');
    worksheet.getCell(row, 2).value = revenue.platforms.map(p => p.platform.name).join(', ');
    worksheet.getCell(row, 3).value = revenue.driver?.name || '-';
    worksheet.getCell(row, 4).value = revenue.vehicle?.name || '-';
    worksheet.getCell(row, 5).value = revenue.amount;
    worksheet.getCell(row, 5).numFmt = 'R$ #,##0.00';
    row++;
  });

  // Total
  worksheet.getCell(row, 4).value = 'Total:';
  worksheet.getCell(row, 4).font = { bold: true };
  worksheet.getCell(row, 4).alignment = { horizontal: 'right' };
  const totalRevenues = revenues.reduce((sum, r) => sum + r.amount, 0);
  worksheet.getCell(row, 5).value = totalRevenues;
  worksheet.getCell(row, 5).numFmt = 'R$ #,##0.00';
  worksheet.getCell(row, 5).font = { bold: true };
  worksheet.getCell(row, 5).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE5E7EB' },
  };
  row++;

  return row;
}

function addDriversSheet(
  worksheet: ExcelJS.Worksheet,
  drivers: ReportData['drivers'],
  startRow: number
): number {
  if (!drivers || drivers.length === 0) {
    return startRow;
  }

  let row = startRow;

  // Cabeçalho
  const headerCell = worksheet.getCell(`A${row}`);
  headerCell.value = 'PERFORMANCE POR MOTORISTA';
  headerCell.font = { size: 12, bold: true };
  worksheet.mergeCells(`A${row}:F${row}`);
  row++;

  // Ajustar larguras
  worksheet.getColumn(6).width = 15;

  // Cabeçalhos da tabela
  const headers = ['Motorista', 'Viagens', 'Receita', 'Despesas', 'Lucro Líquido', 'Média/Viagem'];
  headers.forEach((header, index) => {
    const cell = worksheet.getCell(row, index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' },
    };
    cell.alignment = { horizontal: 'center' };
  });
  row++;

  // Dados
  drivers.forEach((driver) => {
    worksheet.getCell(row, 1).value = driver.name;
    worksheet.getCell(row, 2).value = driver.trips;
    worksheet.getCell(row, 3).value = driver.totalRevenue;
    worksheet.getCell(row, 3).numFmt = 'R$ #,##0.00';
    worksheet.getCell(row, 4).value = driver.totalExpenses;
    worksheet.getCell(row, 4).numFmt = 'R$ #,##0.00';
    worksheet.getCell(row, 5).value = driver.netProfit;
    worksheet.getCell(row, 5).numFmt = 'R$ #,##0.00';
    worksheet.getCell(row, 6).value = driver.avgRevenuePerTrip;
    worksheet.getCell(row, 6).numFmt = 'R$ #,##0.00';
    row++;
  });

  return row;
}

function addVehiclesSheet(
  worksheet: ExcelJS.Worksheet,
  vehicles: ReportData['vehicles'],
  startRow: number
): number {
  if (!vehicles || vehicles.length === 0) {
    return startRow;
  }

  let row = startRow;

  // Cabeçalho
  const headerCell = worksheet.getCell(`A${row}`);
  headerCell.value = 'PERFORMANCE POR VEÍCULO';
  headerCell.font = { size: 12, bold: true };
  worksheet.mergeCells(`A${row}:F${row}`);
  row++;

  // Ajustar larguras
  worksheet.getColumn(6).width = 15;

  // Cabeçalhos da tabela
  const headers = ['Veículo', 'Receita', 'Despesas', 'Lucro Líquido', 'KM Rodados', 'Custo/KM'];
  headers.forEach((header, index) => {
    const cell = worksheet.getCell(row, index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' },
    };
    cell.alignment = { horizontal: 'center' };
  });
  row++;

  // Dados
  vehicles.forEach((vehicle) => {
    worksheet.getCell(row, 1).value = vehicle.name;
    worksheet.getCell(row, 2).value = vehicle.totalRevenue;
    worksheet.getCell(row, 2).numFmt = 'R$ #,##0.00';
    worksheet.getCell(row, 3).value = vehicle.totalExpenses;
    worksheet.getCell(row, 3).numFmt = 'R$ #,##0.00';
    worksheet.getCell(row, 4).value = vehicle.netProfit;
    worksheet.getCell(row, 4).numFmt = 'R$ #,##0.00';
    worksheet.getCell(row, 5).value = vehicle.kmDriven;
    worksheet.getCell(row, 6).value = vehicle.costPerKm;
    worksheet.getCell(row, 6).numFmt = 'R$ #,##0.00';
    row++;
  });

  return row;
}
