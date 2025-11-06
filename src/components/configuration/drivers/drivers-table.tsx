'use client';

import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deleteDriver } from '@/app/[locale]/(financial)/dashboard/drivers/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { ColumnDef } from '@tanstack/react-table';

interface Driver {
  id: string;
  name: string;
}

interface DriversTableProps {
  drivers: Driver[];
}

export function DriversTable({ drivers }: DriversTableProps) {
  const t = useScopedI18n('configuration.drivers');
  const tCommon = useScopedI18n('common');
  const tNoData = useScopedI18n('dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteDriver(id);
        toast.success(tCommon('deleteSuccess'));
      } catch {
        toast.error(tCommon('error'));
      }
    });
  }

  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{tCommon('actions')}</div>,
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/drivers/${driver.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(driver.id)}
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
      data={drivers}
      searchKey="name"
      searchPlaceholder={tCommon('search')}
      noResultsText={tNoData('noData')}
    />
  );
}
