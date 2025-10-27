'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useScopedI18n } from '@/locales/client';
import { format } from 'date-fns';
import type { ReportType, PlanType, PartnerCategory } from '@prisma/client';
import { ExportButtons } from './export-buttons';
import { PartnerCallout } from './partner-callout';
import { ReportPreview } from './report-preview';
import { getRandomPartnerByCategory } from '@/lib/reports/marketing/partners';
import type { PartnerRecommendation } from '@/lib/reports/types';

interface FilterOptions {
  drivers: { id: string; name: string }[];
  vehicles: { id: string; name: string }[];
  expenseTypes: { id: string; name: string }[];
  platforms: { id: string; name: string }[];
}

interface ReportViewerProps {
  reportConfig: {
    id: string;
    type: ReportType;
    name: string;
    description: string;
    icon: any;
    filters: readonly string[];
    partnerCategory: string | null;
  };
  userId: string;
  userPlanType: PlanType;
  filterOptions: FilterOptions;
}

export function ReportViewer({ reportConfig, filterOptions, userPlanType }: ReportViewerProps) {
  const t = useScopedI18n('shared.reports');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    driverId: '',
    vehicleId: '',
    expenseTypeId: '',
    platformId: '',
  });

  const [partnerRecommendation, setPartnerRecommendation] = useState<PartnerRecommendation | null>(null);

  useEffect(() => {
    // Only show recommendations for FREE users with a partner category
    if (userPlanType === 'FREE' && reportConfig.partnerCategory) {
      const partnerData = getRandomPartnerByCategory(reportConfig.partnerCategory as PartnerCategory, userPlanType);
      if (partnerData) {
        // Mock potential savings for demo
        const mockSavings = Math.random() * 300 + 100; // R$ 100-400
        const partner = {
          ...partnerData,
          id: 'mock-id',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setPartnerRecommendation({
          partner,
          potentialSavings: mockSavings,
          message: `Com ${partner.name}, você pode economizar significativamente nos custos de ${reportConfig.partnerCategory.toLowerCase()}.`,
          placement: 'callout',
        });
      }
    }
  }, [reportConfig.partnerCategory, userPlanType]);

  const showDriverFilter = reportConfig.filters.includes('driver');
  const showVehicleFilter = reportConfig.filters.includes('vehicle');
  const showExpenseTypeFilter = reportConfig.filters.includes('expenseType');
  const showPlatformFilter = reportConfig.filters.includes('platform');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('period')}</CardTitle>
          <CardDescription>
            Selecione o período e filtros para gerar o relatório
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('startDate')}</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">{t('endDate')}</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>

          {(showDriverFilter || showVehicleFilter || showExpenseTypeFilter || showPlatformFilter) && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              {showDriverFilter && (
                <div className="space-y-2">
                  <Label htmlFor="driver">{tCommon('driver')}</Label>
                  <Select
                    value={filters.driverId}
                    onValueChange={(value) => setFilters({ ...filters, driverId: value })}
                  >
                    <SelectTrigger id="driver">
                      <SelectValue placeholder={tCommon('allDrivers')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{tCommon('allDrivers')}</SelectItem>
                      {filterOptions.drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showVehicleFilter && (
                <div className="space-y-2">
                  <Label htmlFor="vehicle">{tCommon('vehicle')}</Label>
                  <Select
                    value={filters.vehicleId}
                    onValueChange={(value) => setFilters({ ...filters, vehicleId: value })}
                  >
                    <SelectTrigger id="vehicle">
                      <SelectValue placeholder={tCommon('allVehicles')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{tCommon('allVehicles')}</SelectItem>
                      {filterOptions.vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showExpenseTypeFilter && (
                <div className="space-y-2">
                  <Label htmlFor="expenseType">Tipo de Despesa</Label>
                  <Select
                    value={filters.expenseTypeId}
                    onValueChange={(value) => setFilters({ ...filters, expenseTypeId: value })}
                  >
                    <SelectTrigger id="expenseType">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      {filterOptions.expenseTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showPlatformFilter && (
                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select
                    value={filters.platformId}
                    onValueChange={(value) => setFilters({ ...filters, platformId: value })}
                  >
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Todas as plataformas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as plataformas</SelectItem>
                      {filterOptions.platforms.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {partnerRecommendation && (
        <PartnerCallout recommendation={partnerRecommendation} />
      )}

      <ReportPreview
        reportType={reportConfig.type}
        startDate={new Date(filters.startDate)}
        endDate={new Date(filters.endDate)}
        filters={{
          driverId: filters.driverId && filters.driverId !== 'all' ? filters.driverId : undefined,
          vehicleId: filters.vehicleId && filters.vehicleId !== 'all' ? filters.vehicleId : undefined,
          expenseTypeId: filters.expenseTypeId && filters.expenseTypeId !== 'all' ? filters.expenseTypeId : undefined,
          platformId: filters.platformId && filters.platformId !== 'all' ? filters.platformId : undefined,
        }}
      />

      <ExportButtons
        reportType={reportConfig.type}
        startDate={new Date(filters.startDate)}
        endDate={new Date(filters.endDate)}
        filters={{
          driverId: filters.driverId && filters.driverId !== 'all' ? filters.driverId : undefined,
          vehicleId: filters.vehicleId && filters.vehicleId !== 'all' ? filters.vehicleId : undefined,
          expenseTypeId: filters.expenseTypeId && filters.expenseTypeId !== 'all' ? filters.expenseTypeId : undefined,
          platformId: filters.platformId && filters.platformId !== 'all' ? filters.platformId : undefined,
        }}
        disabled={isPending}
      />
    </div>
  );
}
