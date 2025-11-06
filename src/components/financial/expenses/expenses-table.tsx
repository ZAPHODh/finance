'use client';

import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deleteExpense } from '@/app/[locale]/(financial)/dashboard/expenses/actions';
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

type ExpenseWithRelations = {
  id: string;
  amount: number;
  date: Date;
  expenseType: {
    id: string;
    name: string;
  };
  driver: {
    id: string;
    name: string;
  } | null;
  vehicle: {
    id: string;
    name: string;
  } | null;
};

interface ExpensesTableProps {
  expenses: ExpenseWithRelations[];
  expenseTypes: { id: string; name: string }[];
  drivers: { id: string; name: string }[];
  vehicles: { id: string; name: string }[];
}

export function ExpensesTable({ expenses, expenseTypes, drivers, vehicles }: ExpensesTableProps) {
  const t = useScopedI18n('financial.expenses');
  const tCommon = useScopedI18n('common');
  const tFilters = useScopedI18n('ui.filters');
  const tEntities = useScopedI18n('entities');
  const tNoData = useScopedI18n('dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [selectedExpenseTypeIds, setSelectedExpenseTypeIds] = useState<string[]>([]);
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesDateRange =
        !dateRange?.from ||
        (new Date(expense.date) >= dateRange.from &&
          (!dateRange.to || new Date(expense.date) <= dateRange.to));

      const matchesMinAmount = !minAmount || expense.amount >= parseFloat(minAmount);
      const matchesMaxAmount = !maxAmount || expense.amount <= parseFloat(maxAmount);

      const matchesType =
        selectedExpenseTypeIds.length === 0 ||
        selectedExpenseTypeIds.includes(expense.expenseType.id);

      const matchesDriver =
        selectedDriverIds.length === 0 ||
        (expense.driver && selectedDriverIds.includes(expense.driver.id));

      const matchesVehicle =
        selectedVehicleIds.length === 0 ||
        (expense.vehicle && selectedVehicleIds.includes(expense.vehicle.id));

      return (
        matchesDateRange &&
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesType &&
        matchesDriver &&
        matchesVehicle
      );
    });
  }, [
    expenses,
    dateRange,
    minAmount,
    maxAmount,
    selectedExpenseTypeIds,
    selectedDriverIds,
    selectedVehicleIds,
  ]);

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteExpense(id);
        toast.success(tCommon('deleteSuccess'));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const columns: ColumnDef<ExpenseWithRelations>[] = [
    {
      accessorKey: 'date',
      header: t('date'),
      cell: ({ row }) => <div className="font-medium">{formatDate(row.getValue('date'))}</div>,
    },
    {
      accessorKey: 'expenseType.name',
      header: t('expenseType'),
      cell: ({ row }) => <div>{row.original.expenseType.name}</div>,
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
        const expense = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/expenses/${expense.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(expense.id)}
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
    setSelectedExpenseTypeIds([]);
    setSelectedDriverIds([]);
    setSelectedVehicleIds([]);
  }

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateRange?.from) count++;
    if (minAmount || maxAmount) count++;
    count += selectedExpenseTypeIds.length;
    count += selectedDriverIds.length;
    count += selectedVehicleIds.length;
    return count;
  }, [dateRange, minAmount, maxAmount, selectedExpenseTypeIds, selectedDriverIds, selectedVehicleIds]);

  const activeFilters = useMemo(() => {
    const filters: ActiveFilter[] = [];

    selectedExpenseTypeIds.forEach((id) => {
      const type = expenseTypes.find((t) => t.id === id);
      if (type) {
        filters.push({
          id: `type-${id}`,
          label: t('expenseType'),
          value: type.name,
          onRemove: () =>
            setSelectedExpenseTypeIds((prev) => prev.filter((i) => i !== id)),
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
  }, [selectedExpenseTypeIds, selectedDriverIds, selectedVehicleIds, expenseTypes, drivers, vehicles, t, tEntities]);

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
            label={t('expenseType')}
            options={expenseTypes}
            selectedIds={selectedExpenseTypeIds}
            onSelectionChange={setSelectedExpenseTypeIds}
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
        data={filteredExpenses}
        searchKey="expenseType.name"
        searchPlaceholder={tCommon('search')}
        noResultsText={tNoData('noData')}
      />
    </div>
  );
}
