'use client';

import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deletePaymentMethod } from '@/app/[locale]/(financial)/dashboard/payment-methods/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { ColumnDef } from '@tanstack/react-table';

interface PaymentMethod {
  id: string;
  name: string;
}

interface PaymentMethodsTableProps {
  paymentMethods: PaymentMethod[];
}

export function PaymentMethodsTable({ paymentMethods }: PaymentMethodsTableProps) {
  const t = useScopedI18n('shared.configuration.paymentMethods');
  const tCommon = useScopedI18n('shared.common');
  const tNoData = useScopedI18n('shared.sidebar.dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deletePaymentMethod(id);
        toast.success(tCommon('deleteSuccess'));
      } catch {
        toast.error(tCommon('error'));
      }
    });
  }

  const columns: ColumnDef<PaymentMethod>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{tCommon('actions')}</div>,
      cell: ({ row }) => {
        const paymentMethod = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/payment-methods/${paymentMethod.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(paymentMethod.id)}
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
      data={paymentMethods}
      searchKey="name"
      searchPlaceholder={tCommon('search')}
      noResultsText={tNoData('noData')}
    />
  );
}
