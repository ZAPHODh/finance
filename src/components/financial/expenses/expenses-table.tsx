'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash, Search } from 'lucide-react';
import Link from 'next/link';
import { deleteExpense } from '@/app/[locale]/(financial)/dashboard/expenses/actions';
import { toast } from 'sonner';
import { useState, useMemo, useTransition } from 'react';

interface Expense {
  id: string;
  description: string | null;
  amount: number;
  date: Date;
  kmDriven: number | null;
  expenseType: {
    id: string;
    name: string;
  };
  paymentMethod: {
    id: string;
    name: string;
  } | null;
  driver: {
    id: string;
    name: string;
  } | null;
  vehicle: {
    id: string;
    name: string;
  } | null;
}

interface ExpenseType {
  id: string;
  name: string;
}

interface Driver {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  name: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
  expenseTypes: ExpenseType[];
  drivers: Driver[];
  vehicles: Vehicle[];
}

export function ExpensesTable({ expenses, expenseTypes, drivers, vehicles }: ExpensesTableProps) {
  const t = useScopedI18n('shared.financial.expenses');
  const tCommon = useScopedI18n('shared.common');
  const tNoData = useScopedI18n('shared.sidebar.dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = searchTerm === '' ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expenseType.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedExpenseType === 'all' || expense.expenseType.id === selectedExpenseType;
      const matchesDriver = selectedDriver === 'all' || expense.driver?.id === selectedDriver;
      const matchesVehicle = selectedVehicle === 'all' || expense.vehicle?.id === selectedVehicle;

      return matchesSearch && matchesType && matchesDriver && matchesVehicle;
    });
  }, [expenses, searchTerm, selectedExpenseType, selectedDriver, selectedVehicle]);

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      const result = await deleteExpense({ id });

      if (result?.serverError) {
        toast.error(result.serverError.message || tCommon('error'));
      } else {
        toast.success(tCommon('deleteSuccess'));
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tCommon('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
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

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('date')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('description')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('expenseType')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('driver')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('vehicle')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm text-right">
                  {t('amount')}
                </TableHead>
                <TableHead className="p-3 text-right font-semibold text-foreground text-sm">
                  {tCommon('actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-6 text-center text-muted-foreground">
                    {tNoData('noData')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="p-3 font-medium">
                      {formatDate(expense.date)}
                    </TableCell>
                    <TableCell className="p-3">
                      {expense.description || '-'}
                    </TableCell>
                    <TableCell className="p-3">
                      {expense.expenseType.name}
                    </TableCell>
                    <TableCell className="p-3">
                      {expense.driver?.name || '-'}
                    </TableCell>
                    <TableCell className="p-3">
                      {expense.vehicle?.name || '-'}
                    </TableCell>
                    <TableCell className="p-3 text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell className="p-3 text-right">
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
