'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deleteRevenue, type RevenueWithRelations } from '@/app/[locale]/(financial)/dashboard/revenues/actions';
import { toast } from 'sonner';
import { useState, useMemo, useTransition } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { ColumnDef } from '@tanstack/react-table';

interface RevenuesTableProps {
  revenues: RevenueWithRelations[];
  platforms: { id: string; name: string }[];
  drivers: { id: string; name: string }[];
  vehicles: { id: string; name: string }[];
}

export function RevenuesTable({ revenues, platforms, drivers, vehicles }: RevenuesTableProps) {
  const t = useScopedI18n('shared.financial.revenues');
  const tCommon = useScopedI18n('shared.common');
  const tNoData = useScopedI18n('shared.sidebar.dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  const filteredRevenues = useMemo(() => {
    return revenues.filter((revenue) => {
      const matchesPlatform = selectedPlatform === 'all' || revenue.platforms.some(p => p.platform.id === selectedPlatform);
      const matchesDriver = selectedDriver === 'all' || revenue.driver?.id === selectedDriver;
      const matchesVehicle = selectedVehicle === 'all' || revenue.vehicle?.id === selectedVehicle;

      return matchesPlatform && matchesDriver && matchesVehicle;
    });
  }, [revenues, selectedPlatform, selectedDriver, selectedVehicle]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger>
            <SelectValue placeholder={t('platform')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('filter')}</SelectItem>
            {platforms.map((platform) => (
              <SelectItem key={platform.id} value={platform.id}>
                {platform.name}
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
        data={filteredRevenues}
        searchKey="platforms"
        searchPlaceholder={tCommon('search')}
        noResultsText={tNoData('noData')}
      />
    </div>
  );
}
