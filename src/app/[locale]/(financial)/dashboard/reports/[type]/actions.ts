'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import type { ReportType } from "@prisma/client";
import type { ReportData, ExportFormat } from "@/lib/reports/types";
import { generateCSV } from "@/lib/reports/generators/csv";
import { generatePDF } from "@/lib/reports/generators/pdf";
import { generateExcel } from "@/lib/reports/generators/excel";
import { generateReportFilename } from "@/lib/reports/storage/file-system";
import { checkIfExportLimitReached, incrementExportCount } from "@/lib/plans/plan-checker";

interface ExportReportParams {
  reportType: ReportType;
  format: ExportFormat;
  startDate: Date;
  endDate: Date;
  filters?: {
    driverId?: string;
    vehicleId?: string;
    expenseTypeId?: string;
    platformId?: string;
  };
}

export async function exportReport(params: ExportReportParams) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verificar limite do plano
  const limitReached = await checkIfExportLimitReached();
  if (limitReached) {
    throw new Error("Você atingiu o limite de exportações do seu plano. Faça upgrade para exportar mais relatórios.");
  }

  const { reportType, format, startDate, endDate, filters } = params;

  // Fetch report data based on type and filters
  const reportData = await fetchReportData(user.id, reportType, startDate, endDate, filters);

  // Generate file based on format
  let buffer: Buffer;
  let filename: string;
  let mimeType: string;

  switch (format) {
    case 'csv':
      buffer = await generateCSV(reportType, reportData);
      filename = generateReportFilename(reportType.toLowerCase(), format);
      mimeType = 'text/csv';
      break;

    case 'pdf':
      buffer = await generatePDF(reportType, reportData);
      filename = generateReportFilename(reportType.toLowerCase(), format);
      mimeType = 'application/pdf';
      break;

    case 'excel':
      buffer = await generateExcel(reportType, reportData);
      filename = generateReportFilename(reportType.toLowerCase(), format);
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  // Convert buffer to base64 for transmission
  const base64 = buffer.toString('base64');

  // Incrementar contador de exports
  await incrementExportCount();

  return {
    data: base64,
    filename,
    mimeType
  };
}

async function fetchReportData(
  userId: string,
  reportType: ReportType,
  startDate: Date,
  endDate: Date,
  filters?: {
    driverId?: string;
    vehicleId?: string;
    expenseTypeId?: string;
    platformId?: string;
  }
): Promise<ReportData> {
  const baseWhere = {
    userId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  switch (reportType) {
    case 'EXPENSE_BREAKDOWN':
      const expenses = await prisma.expense.findMany({
        where: {
          ...baseWhere,
          ...(filters?.driverId && { driverId: filters.driverId }),
          ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
          ...(filters?.expenseTypeId && { expenseTypeId: filters.expenseTypeId }),
        },
        include: {
          expenseType: true,
          driver: true,
          vehicle: true,
        },
        orderBy: { date: 'desc' },
      });

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

      return {
        expenses: expenses.map(e => ({
          id: e.id,
          date: e.date,
          amount: e.amount,
          expenseType: { name: e.expenseType.name },
          driver: e.driver ? { name: e.driver.name } : undefined,
          vehicle: e.vehicle ? { name: e.vehicle.name } : undefined,
        })),
        summary: {
          totalExpenses,
          totalRevenue: 0,
          netProfit: -totalExpenses,
          profitMargin: 0,
        },
      };

    case 'REVENUE_BREAKDOWN':
      const revenues = await prisma.revenue.findMany({
        where: {
          ...baseWhere,
          ...(filters?.driverId && { driverId: filters.driverId }),
          ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
        },
        include: {
          platforms: {
            include: {
              platform: true,
            },
          },
          driver: true,
          vehicle: true,
        },
        orderBy: { date: 'desc' },
      });

      const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

      return {
        revenues: revenues.map(r => ({
          id: r.id,
          date: r.date,
          amount: r.amount,
          platforms: r.platforms.map(p => ({ platform: { name: p.platform.name } })),
          driver: r.driver ? { name: r.driver.name } : undefined,
          vehicle: r.vehicle ? { name: r.vehicle.name } : undefined,
        })),
        summary: {
          totalRevenue,
          totalExpenses: 0,
          netProfit: totalRevenue,
          profitMargin: 100,
        },
      };

    case 'MONTHLY_SUMMARY':
    case 'DRE':
      const [allExpenses, allRevenues] = await Promise.all([
        prisma.expense.findMany({
          where: {
            ...baseWhere,
            ...(filters?.driverId && { driverId: filters.driverId }),
            ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
          },
          include: {
            expenseType: true,
            driver: true,
            vehicle: true,
          },
        }),
        prisma.revenue.findMany({
          where: {
            ...baseWhere,
            ...(filters?.driverId && { driverId: filters.driverId }),
            ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
          },
          include: {
            platforms: {
              include: {
                platform: true,
              },
            },
            driver: true,
            vehicle: true,
          },
        }),
      ]);

      const summaryTotalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);
      const summaryTotalRevenue = allRevenues.reduce((sum, r) => sum + r.amount, 0);
      const netProfit = summaryTotalRevenue - summaryTotalExpenses;
      const profitMargin = summaryTotalRevenue > 0 ? (netProfit / summaryTotalRevenue) * 100 : 0;

      return {
        expenses: allExpenses.map(e => ({
          id: e.id,
          date: e.date,
          amount: e.amount,
          expenseType: { name: e.expenseType.name },
          driver: e.driver ? { name: e.driver.name } : undefined,
          vehicle: e.vehicle ? { name: e.vehicle.name } : undefined,
        })),
        revenues: allRevenues.map(r => ({
          id: r.id,
          date: r.date,
          amount: r.amount,
          platforms: r.platforms.map(p => ({ platform: { name: p.platform.name } })),
          driver: r.driver ? { name: r.driver.name } : undefined,
          vehicle: r.vehicle ? { name: r.vehicle.name } : undefined,
        })),
        summary: {
          totalRevenue: summaryTotalRevenue,
          totalExpenses: summaryTotalExpenses,
          netProfit,
          profitMargin,
        },
      };

    case 'DRIVER_PERFORMANCE':
      const driversData = await prisma.driver.findMany({
        where: {
          userId,
          ...(filters?.driverId && { id: filters.driverId }),
        },
        include: {
          expenses: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          revenues: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      });

      const drivers = driversData.map(driver => {
        const driverTotalRevenue = driver.revenues.reduce((sum, r) => sum + r.amount, 0);
        const driverTotalExpenses = driver.expenses.reduce((sum, e) => sum + e.amount, 0);
        const driverNetProfit = driverTotalRevenue - driverTotalExpenses;
        const trips = driver.revenues.length;
        const avgRevenuePerTrip = trips > 0 ? driverTotalRevenue / trips : 0;

        return {
          id: driver.id,
          name: driver.name,
          totalRevenue: driverTotalRevenue,
          totalExpenses: driverTotalExpenses,
          netProfit: driverNetProfit,
          trips,
          avgRevenuePerTrip,
        };
      });

      return {
        drivers,
        summary: {
          totalRevenue: drivers.reduce((sum, d) => sum + d.totalRevenue, 0),
          totalExpenses: drivers.reduce((sum, d) => sum + d.totalExpenses, 0),
          netProfit: drivers.reduce((sum, d) => sum + d.netProfit, 0),
          profitMargin: 0,
        },
      };

    case 'VEHICLE_PERFORMANCE':
      const vehiclesData = await prisma.vehicle.findMany({
        where: {
          userId,
          ...(filters?.vehicleId && { id: filters.vehicleId }),
        },
        include: {
          expenses: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          revenues: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      });

      const vehicles = vehiclesData.map(vehicle => {
        const vehicleTotalRevenue = vehicle.revenues.reduce((sum, r) => sum + r.amount, 0);
        const vehicleTotalExpenses = vehicle.expenses.reduce((sum, e) => sum + e.amount, 0);
        const vehicleNetProfit = vehicleTotalRevenue - vehicleTotalExpenses;
        const kmDriven = vehicle.revenues.length * 50; // Mock value
        const costPerKm = kmDriven > 0 ? vehicleTotalExpenses / kmDriven : 0;

        return {
          id: vehicle.id,
          name: vehicle.name,
          totalRevenue: vehicleTotalRevenue,
          totalExpenses: vehicleTotalExpenses,
          netProfit: vehicleNetProfit,
          kmDriven,
          costPerKm,
        };
      });

      return {
        vehicles,
        summary: {
          totalRevenue: vehicles.reduce((sum, v) => sum + v.totalRevenue, 0),
          totalExpenses: vehicles.reduce((sum, v) => sum + v.totalExpenses, 0),
          netProfit: vehicles.reduce((sum, v) => sum + v.netProfit, 0),
          profitMargin: 0,
        },
      };

    default:
      throw new Error(`Report type ${reportType} not implemented`);
  }
}
