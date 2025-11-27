import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ReportData } from '../types';
import type { ReportType } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


export async function generatePDF(
  reportType: ReportType,
  reportData: ReportData
): Promise<Buffer> {
  const doc = new jsPDF();


  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;


  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(getReportTitle(reportType), margin, 20);


  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`, margin, 28);

  let currentY = 35;


  if (reportData.summary) {
    currentY = addSummarySection(doc, reportData.summary, currentY, margin, pageWidth);
  }

  switch (reportType) {
    case 'EXPENSE_BREAKDOWN':
      if (reportData.expenses) {
        currentY = addExpensesTable(doc, reportData.expenses, currentY);
      }
      break;

    case 'REVENUE_BREAKDOWN':
      if (reportData.revenues) {
        currentY = addRevenuesTable(doc, reportData.revenues, currentY);
      }
      break;

    case 'MONTHLY_SUMMARY':
    case 'DRE':
      if (reportData.expenses && reportData.revenues) {
        currentY = addExpensesTable(doc, reportData.expenses, currentY);
        currentY += 10;
        currentY = addRevenuesTable(doc, reportData.revenues, currentY);
      }
      break;

    case 'DRIVER_PERFORMANCE':
      if (reportData.drivers) {
        currentY = addDriversTable(doc, reportData.drivers, currentY);
      }
      break;

    case 'VEHICLE_PERFORMANCE':
      if (reportData.vehicles) {
        currentY = addVehiclesTable(doc, reportData.vehicles, currentY);
      }
      break;
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }


  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
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
  doc: jsPDF,
  summary: ReportData['summary'],
  startY: number,
  margin: number,
  pageWidth: number
): number {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Financeiro', margin, startY);

  const boxY = startY + 5;
  const boxHeight = 35;

  doc.setFillColor(245, 245, 245);
  doc.rect(margin, boxY, pageWidth - 2 * margin, boxHeight, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const textY = boxY + 8;
  const lineHeight = 7;

  doc.text('Receita Total:', margin + 5, textY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 197, 94); // green
  doc.text(`R$ ${summary.totalRevenue.toFixed(2)}`, margin + 60, textY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Despesas Total:', margin + 5, textY + lineHeight);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68); // red
  doc.text(`R$ ${summary.totalExpenses.toFixed(2)}`, margin + 60, textY + lineHeight);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Lucro Líquido:', margin + 5, textY + lineHeight * 2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(summary.netProfit >= 0 ? 34 : 239, summary.netProfit >= 0 ? 197 : 68, summary.netProfit >= 0 ? 94 : 68);
  doc.text(`R$ ${summary.netProfit.toFixed(2)}`, margin + 60, textY + lineHeight * 2);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Margem de Lucro:', margin + 5, textY + lineHeight * 3);
  doc.setFont('helvetica', 'bold');
  doc.text(`${summary.profitMargin.toFixed(2)}%`, margin + 60, textY + lineHeight * 3);

  doc.setTextColor(0, 0, 0);
  return boxY + boxHeight + 10;
}

function addExpensesTable(doc: jsPDF, expenses: ReportData['expenses'], startY: number): number {
  if (!expenses || expenses.length === 0) {
    return startY;
  }

  autoTable(doc, {
    startY,
    head: [['Data', 'Tipo', 'Motorista', 'Veículo', 'Valor']],
    body: expenses.map(expense => [
      format(new Date(expense.date), 'dd/MM/yyyy'),
      expense.expenseTypes.map(et => et.expenseType.name).join(', '),
      expense.driver?.name || '-',
      expense.vehicle?.name || '-',
      `R$ ${expense.amount.toFixed(2)}`,
    ]),
    foot: [[
      '', '', '', 'Total:',
      `R$ ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`
    ]],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    footStyles: { fillColor: [229, 231, 235], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 9 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

function addRevenuesTable(doc: jsPDF, revenues: ReportData['revenues'], startY: number): number {
  if (!revenues || revenues.length === 0) {
    return startY;
  }

  autoTable(doc, {
    startY,
    head: [['Data', 'Plataformas', 'Motorista', 'Veículo', 'Valor']],
    body: revenues.map(revenue => [
      format(new Date(revenue.date), 'dd/MM/yyyy'),
      revenue.platforms.map(p => p.platform.name).join(', '),
      revenue.driver?.name || '-',
      revenue.vehicle?.name || '-',
      `R$ ${revenue.amount.toFixed(2)}`,
    ]),
    foot: [[
      '', '', '', 'Total:',
      `R$ ${revenues.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}`
    ]],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
    footStyles: { fillColor: [229, 231, 235], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 9 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

function addDriversTable(doc: jsPDF, drivers: ReportData['drivers'], startY: number): number {
  if (!drivers || drivers.length === 0) {
    return startY;
  }

  autoTable(doc, {
    startY,
    head: [['Motorista', 'Viagens', 'Receita', 'Despesas', 'Lucro Líquido', 'Média/Viagem']],
    body: drivers.map(driver => [
      driver.name,
      driver.trips.toString(),
      `R$ ${driver.totalRevenue.toFixed(2)}`,
      `R$ ${driver.totalExpenses.toFixed(2)}`,
      `R$ ${driver.netProfit.toFixed(2)}`,
      `R$ ${driver.avgRevenuePerTrip.toFixed(2)}`,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

function addVehiclesTable(doc: jsPDF, vehicles: ReportData['vehicles'], startY: number): number {
  if (!vehicles || vehicles.length === 0) {
    return startY;
  }

  autoTable(doc, {
    startY,
    head: [['Veículo', 'Receita', 'Despesas', 'Lucro Líquido', 'KM Rodados', 'Custo/KM']],
    body: vehicles.map(vehicle => [
      vehicle.name,
      `R$ ${vehicle.totalRevenue.toFixed(2)}`,
      `R$ ${vehicle.totalExpenses.toFixed(2)}`,
      `R$ ${vehicle.netProfit.toFixed(2)}`,
      vehicle.kmDriven.toString(),
      `R$ ${vehicle.costPerKm.toFixed(2)}`,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}
