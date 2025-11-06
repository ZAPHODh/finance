'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';
import { getReportPreview } from '@/app/[locale]/(financial)/dashboard/reports/[type]/preview-actions';
import type { ReportType } from '@prisma/client';
import { useScopedI18n } from '@/locales/client';

interface ReportPreviewProps {
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

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function ReportPreview({ reportType, startDate, endDate, filters }: ReportPreviewProps) {
  const t = useScopedI18n('reports.preview');
  const [data, setData] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadPreview();
  }, [reportType, startDate, endDate, filters]);

  function loadPreview() {
    startTransition(async () => {
      try {
        const result = await getReportPreview({
          reportType,
          startDate,
          endDate,
          filters,
        });
        setData(result);
      } catch (error) {
        console.error('Error loading preview:', error);
      }
    });
  }

  if (isPending && !data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPreview}
            disabled={isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderPreview(reportType, data, t)}
      </CardContent>
    </Card>
  );
}

function renderPreview(reportType: ReportType, data: any, t: any) {
  switch (reportType) {
    case 'EXPENSE_BREAKDOWN':
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{t('totalExpenses')}</p>
              <p className="text-2xl font-bold">R$ {data.summary.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{t('quantity')}</p>
              <p className="text-2xl font-bold">{data.summary.count}</p>
            </div>
          </div>

          {data.byType && data.byType.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('expensesByType')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.byType}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.name}: R$ ${entry.value.toFixed(2)}`}
                  >
                    {data.byType.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      );

    case 'REVENUE_BREAKDOWN':
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{t('totalRevenue')}</p>
              <p className="text-2xl font-bold text-green-600">R$ {data.summary.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{t('quantity')}</p>
              <p className="text-2xl font-bold">{data.summary.count}</p>
            </div>
          </div>

          {data.byPlatform && data.byPlatform.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('revenueByPlatform')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.byPlatform}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      );

    case 'MONTHLY_SUMMARY':
    case 'DRE':
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{t('totalExpenses')}</p>
              <p className="text-2xl font-bold text-red-600">R$ {data.summary.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{t('quantity')}</p>
              <p className="text-2xl font-bold">{data.summary.count}</p>
            </div>
          </div>

          {data.byType && data.byType.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('expensesDistribution')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.byType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      );

    case 'DRIVER_PERFORMANCE':
      return (
        <>
          {data.drivers && data.drivers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('performanceByDriver')}</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.drivers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#22c55e" name={t('revenue')} />
                  <Bar dataKey="expenses" fill="#ef4444" name={t('expenses')} />
                  <Bar dataKey="profit" fill="#3b82f6" name={t('profit')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      );

    case 'VEHICLE_PERFORMANCE':
      return (
        <>
          {data.vehicles && data.vehicles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('performanceByVehicle')}</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.vehicles}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#22c55e" name={t('revenue')} />
                  <Bar dataKey="expenses" fill="#ef4444" name={t('expenses')} />
                  <Bar dataKey="profit" fill="#3b82f6" name={t('profit')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      );

    default:
      return <p className="text-muted-foreground">{t('notAvailable')}</p>;
  }
}
