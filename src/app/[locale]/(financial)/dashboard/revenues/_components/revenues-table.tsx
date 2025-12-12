'use client';

import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deleteRevenue } from '@/app/[locale]/(financial)/dashboard/revenues/actions';
import type { RevenueWithRelations } from '@/types/prisma';
import { toast } from 'sonner';
import { useState, useMemo, useTransition } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { ColumnDef } from '@tanstack/react-table';
import { FilterPopover } from '@/components/ui/filters/filter-popover';
import { DateRangePicker } from '@/components/ui/filters/date-range-picker';
import { AmountRangeFilter } from '@/components/ui/filters/amount-range-filter';
import { MultiSelectFilter } from '@/components/ui/filters/multi-select-filter';
import { ActiveFilterBadges, ActiveFilter } from '@/components/ui/filters/active-filter-badges';
import { DateRange } from 'react-day-picker';
import { formatCurrency } from '@/lib/utils';

interface RevenuesTableProps {
  revenues: RevenueWithRelations[];
  platforms: { id: string; name: string }[];
  drivers: { id: string; name: string }[];
  vehicles: { id: string; name: string }[];
}

export function RevenuesTable({ revenues, platforms, drivers, vehicles }: RevenuesTableProps) {
  const t = useScopedI18n('financial.revenues');
  const tCommon = useScopedI18n('common');
  const tFilters = useScopedI18n('ui.filters');
  const tEntities = useScopedI18n('entities');
  const tNoData = useScopedI18n('dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);

  const filteredRevenues = useMemo(() => {
    return revenues.filter((revenue) => {
      const matchesDateRange =
        !dateRange?.from ||
        (new Date(revenue.date) >= dateRange.from &&
          (!dateRange.to || new Date(revenue.date) <= dateRange.to));

      const matchesMinAmount = !minAmount || revenue.amount >= parseFloat(minAmount);
      const matchesMaxAmount = !maxAmount || revenue.amount <= parseFloat(maxAmount);

      const matchesPlatform =
        selectedPlatformIds.length === 0 ||
        revenue.platforms.some((p) => selectedPlatformIds.includes(p.platform.id));

      const matchesDriver =
        selectedDriverIds.length === 0 ||
        (revenue.driver && selectedDriverIds.includes(revenue.driver.id));

      const matchesVehicle =
        selectedVehicleIds.length === 0 ||
        (revenue.vehicle && selectedVehicleIds.includes(revenue.vehicle.id));

      return (
        matchesDateRange &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesPlatform &&
        matchesDriver &&
        matchesVehicle
      );
    });
  }, [
    revenues,
    dateRange,
    minAmount,
    maxAmount,
    selectedPlatformIds,
    selectedDriverIds,
    selectedVehicleIds,
  ]);

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteRevenue(id);
        toast.success(tCommon('deleteSuccess'));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
    });
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const columns: ColumnDef<RevenueWithRelations>[] = [
    {
      accessorKey: 'date',
      header: t('date'),
      cell: ({ row }) => <div className="font-medium">{formatDate(row.getValue('date'))}</div>,
    },
    {
      id: 'platforms',
      header: t('platforms'),
      cell: ({ row }) => {
        const revenue = row.original;
        return (
          <div>
            {revenue.platforms.length > 0
              ? revenue.platforms.map(p => p.platform.name).join(', ')
              : '-'}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const revenue = row.original;
        return revenue.platforms.some(p =>
          p.platform.name.toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      id: 'driver',
      header: tEntities('driver'),
      cell: ({ row }) => <div>{row.original.driver?.name || '-'}</div>,
    },
    {
      id: 'vehicle',
      header: tEntities('vehicle'),
      cell: ({ row }) => <div>{row.original.vehicle?.name || '-'}</div>,
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">{t('amount')}</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{formatCurrency(row.getValue('amount'))}</div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{tCommon('actions')}</div>,
      cell: ({ row }) => {
        const revenue = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/revenues/${revenue.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(revenue.id)}
              disabled={isPending}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  function clearAllFilters() {
    setDateRange(undefined);
    setMinAmount('');
    setMaxAmount('');
    setSelectedPlatformIds([]);
    setSelectedDriverIds([]);
    setSelectedVehicleIds([]);
  }

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateRange?.from) count++;
    if (minAmount || maxAmount) count++;
    count += selectedPlatformIds.length;
    count += selectedDriverIds.length;
    count += selectedVehicleIds.length;
    return count;
  }, [dateRange, minAmount, maxAmount, selectedPlatformIds, selectedDriverIds, selectedVehicleIds]);

  const activeFilters = useMemo(() => {
    const filters: ActiveFilter[] = [];

    selectedPlatformIds.forEach((id) => {
      const platform = platforms.find((p) => p.id === id);
      if (platform) {
        filters.push({
          id: `platform-${id}`,
          label: t('platform'),
          value: platform.name,
          onRemove: () =>
            setSelectedPlatformIds((prev) => prev.filter((i) => i !== id)),
        });
      }
    });

    selectedDriverIds.forEach((id) => {
      const driver = drivers.find((d) => d.id === id);
      if (driver) {
        filters.push({
          id: `driver-${id}`,
          label: tEntities('driver'),
          value: driver.name,
          onRemove: () =>
            setSelectedDriverIds((prev) => prev.filter((i) => i !== id)),
        });
      }
    });

    selectedVehicleIds.forEach((id) => {
      const vehicle = vehicles.find((v) => v.id === id);
      if (vehicle) {
        filters.push({
          id: `vehicle-${id}`,
          label: tEntities('vehicle'),
          value: vehicle.name,
          onRemove: () =>
            setSelectedVehicleIds((prev) => prev.filter((i) => i !== id)),
        });
      }
    });

    return filters;
  }, [selectedPlatformIds, selectedDriverIds, selectedVehicleIds, platforms, drivers, vehicles, t, tEntities]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FilterPopover
          activeFilterCount={activeFilterCount}
          onClearAll={clearAllFilters}
          clearAllLabel={tFilters('clearAll')}
          filtersLabel={tFilters('filters')}
        >
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            label={tFilters('dateRange')}
            placeholder={tFilters('selectDateRange')}
          />
          <AmountRangeFilter
            minAmount={minAmount}
            maxAmount={maxAmount}
            onMinAmountChange={setMinAmount}
            onMaxAmountChange={setMaxAmount}
            label={tFilters('amountRange')}
            minPlaceholder={tFilters('min')}
            maxPlaceholder={tFilters('max')}
          />
          <MultiSelectFilter
            label={t('platforms')}
            options={platforms}
            selectedIds={selectedPlatformIds}
            onSelectionChange={setSelectedPlatformIds}
          />
          <MultiSelectFilter
            label={tEntities('driver')}
            options={drivers}
            selectedIds={selectedDriverIds}
            onSelectionChange={setSelectedDriverIds}
          />
          <MultiSelectFilter
            label={tEntities('vehicle')}
            options={vehicles}
            selectedIds={selectedVehicleIds}
            onSelectionChange={setSelectedVehicleIds}
          />
        </FilterPopover>
      </div>

      <ActiveFilterBadges
        filters={activeFilters}
        dateRange={dateRange}
        onDateRangeRemove={() => setDateRange(undefined)}
        dateRangeLabel={tFilters('dateRange')}
        minAmount={minAmount}
        maxAmount={maxAmount}
        onAmountRangeRemove={() => {
          setMinAmount('');
          setMaxAmount('');
        }}
        amountRangeLabel={tFilters('amountRange')}
      />

      <DataTable
        columns={columns}
        data={filteredRevenues}
        searchKey="platforms"
        searchPlaceholder={tCommon('search')}
        noResultsText={tNoData('noData')}
      />
    </div>
  );
}
