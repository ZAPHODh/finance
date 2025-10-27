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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const t = useScopedI18n('shared.financial.expenses');
  const tCommon = useScopedI18n('shared.common');
  const tNoData = useScopedI18n('shared.sidebar.dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  const [selectedExpenseType, setSelectedExpenseType] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesType = selectedExpenseType === 'all' || expense.expenseType.id === selectedExpenseType;
      const matchesDriver = selectedDriver === 'all' || expense.driver?.id === selectedDriver;
      const matchesVehicle = selectedVehicle === 'all' || expense.vehicle?.id === selectedVehicle;

      return matchesType && matchesDriver && matchesVehicle;
    });
  }, [expenses, selectedExpenseType, selectedDriver, selectedVehicle]);

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
      header: t('driver'),
      cell: ({ row }) => <div>{row.original.driver?.name || '-'}</div>,
    },
    {
      id: 'vehicle',
      header: t('vehicle'),
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedExpenseType} onValueChange={setSelectedExpenseType}>
          <SelectTrigger>
            <SelectValue placeholder={t('expenseType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('filter')}</SelectItem>
            {expenseTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDriver} onValueChange={setSelectedDriver}>
          <SelectTrigger>
            <SelectValue placeholder={t('driver')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('filter')}</SelectItem>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
          <SelectTrigger>
            <SelectValue placeholder={t('vehicle')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('filter')}</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
