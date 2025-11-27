'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import type { ReportType } from "@prisma/client";

interface PreviewParams {
  reportType: ReportType;
  startDate: Date;
  endDate: Date;
  filters?: {
    driverId?: string;
    vehicleId?: string;
    expenseTypeId?: string;
    platformId?: string;
  };
}

export async function getReportPreview(params: PreviewParams) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { reportType, startDate, endDate, filters } = params;

  const baseWhere = {
    userId: user.id,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  switch (reportType) {
    case 'EXPENSE_BREAKDOWN':
    case 'MONTHLY_SUMMARY':
    case 'DRE':
      const expenses = await prisma.expense.findMany({
        where: {
          ...baseWhere,
          ...(filters?.driverId && { driverId: filters.driverId }),
          ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
          ...(filters?.expenseTypeId && {
            expenseTypes: {
              some: {
                expenseTypeId: filters.expenseTypeId
              }
            }
          }),
        },
        include: {
          expenseTypes: {
            include: {
              expenseType: true
            }
          },
        },
      });

      // Agrupar por tipo
      const expensesByType = expenses.reduce((acc, expense) => {
        expense.expenseTypes.forEach(et => {
          const typeName = et.expenseType.name;
          acc[typeName] = (acc[typeName] || 0) + expense.amount;
        });
        return acc;
      }, {} as Record<string, number>);

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

      return {
        summary: {
          totalExpenses,
          count: expenses.length,
        },
        byType: Object.entries(expensesByType).map(([name, value]) => ({
          name,
          value,
        })),
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
        },
      });

      // Agrupar por plataforma
      const revenuesByPlatform: Record<string, number> = {};
      revenues.forEach(revenue => {
        revenue.platforms.forEach(rp => {
          const platformName = rp.platform.name;
          revenuesByPlatform[platformName] = (revenuesByPlatform[platformName] || 0) + revenue.amount;
        });
      });

      const totalRevenues = revenues.reduce((sum, r) => sum + r.amount, 0);

      return {
        summary: {
          totalRevenue: totalRevenues,
          count: revenues.length,
        },
        byPlatform: Object.entries(revenuesByPlatform).map(([name, value]) => ({
          name,
          value,
        })),
      };

    case 'DRIVER_PERFORMANCE':
      const driversData = await prisma.driver.findMany({
        where: {
          userId: user.id,
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

      const driversPerformance = driversData.map(driver => {
        const driverRevenue = driver.revenues.reduce((sum, r) => sum + r.amount, 0);
        const driverExpenses = driver.expenses.reduce((sum, e) => sum + e.amount, 0);
        return {
          name: driver.name,
          revenue: driverRevenue,
          expenses: driverExpenses,
          profit: driverRevenue - driverExpenses,
        };
      });

      return {
        drivers: driversPerformance,
      };

    case 'VEHICLE_PERFORMANCE':
      const vehiclesData = await prisma.vehicle.findMany({
        where: {
          userId: user.id,
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

      const vehiclesPerformance = vehiclesData.map(vehicle => {
        const vehicleRevenue = vehicle.revenues.reduce((sum, r) => sum + r.amount, 0);
        const vehicleExpenses = vehicle.expenses.reduce((sum, e) => sum + e.amount, 0);
        return {
          name: vehicle.name,
          revenue: vehicleRevenue,
          expenses: vehicleExpenses,
          profit: vehicleRevenue - vehicleExpenses,
        };
      });

      return {
        vehicles: vehiclesPerformance,
      };

    default:
      return null;
  }
}
