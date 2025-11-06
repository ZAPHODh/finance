'use client';

import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deleteVehicle } from '@/app/[locale]/(financial)/dashboard/vehicles/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { ColumnDef } from '@tanstack/react-table';

interface Vehicle {
  id: string;
  name: string;
  plate: string | null;
  model: string | null;
}

interface VehiclesTableProps {
  vehicles: Vehicle[];
}

export function VehiclesTable({ vehicles }: VehiclesTableProps) {
  const t = useScopedI18n('configuration.vehicles');
  const tCommon = useScopedI18n('common');
  const tNoData = useScopedI18n('dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteVehicle(id);
        toast.success(tCommon('deleteSuccess'));
      } catch {
        toast.error(tCommon('error'));
      }
    });
  }

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'plate',
      header: t('plate'),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue('plate') || '-'}</div>
      ),
    },
    {
      accessorKey: 'model',
      header: t('model'),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue('model') || '-'}</div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{tCommon('actions')}</div>,
      cell: ({ row }) => {
        const vehicle = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/vehicles/${vehicle.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(vehicle.id)}
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
      data={vehicles}
      searchKey="name"
      searchPlaceholder={tCommon('search')}
      noResultsText={tNoData('noData')}
    />
  );
}
