'use client';

import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deleteExpenseType } from '@/app/[locale]/(financial)/dashboard/expense-types/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { ColumnDef } from '@tanstack/react-table';

interface ExpenseType {
  id: string;
  name: string;
}

interface ExpenseTypesTableProps {
  expenseTypes: ExpenseType[];
}

export function ExpenseTypesTable({ expenseTypes }: ExpenseTypesTableProps) {
  const t = useScopedI18n('configuration.expenseTypes');
  const tCommon = useScopedI18n('common');
  const tNoData = useScopedI18n('dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteExpenseType(id);
        toast.success(tCommon('deleteSuccess'));
      } catch {
        toast.error(tCommon('error'));
      }
    });
  }

  const columns: ColumnDef<ExpenseType>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{tCommon('actions')}</div>,
      cell: ({ row }) => {
        const expenseType = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/expense-types/${expenseType.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(expenseType.id)}
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
    <DataTable
      columns={columns}
      data={expenseTypes}
      searchKey="name"
      searchPlaceholder={tCommon('search')}
      noResultsText={tNoData('noData')}
    />
  );
}
