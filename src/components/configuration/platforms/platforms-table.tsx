'use client';

import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deletePlatform } from '@/app/[locale]/(financial)/dashboard/platforms/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { ColumnDef } from '@tanstack/react-table';

interface Platform {
  id: string;
  name: string;
}

interface PlatformsTableProps {
  platforms: Platform[];
}

export function PlatformsTable({ platforms }: PlatformsTableProps) {
  const t = useScopedI18n('configuration.platforms');
  const tCommon = useScopedI18n('common');
  const tNoData = useScopedI18n('dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deletePlatform(id);
        toast.success(tCommon('deleteSuccess'));
      } catch {
        toast.error(tCommon('error'));
      }
    });
  }

  const columns: ColumnDef<Platform>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{tCommon('actions')}</div>,
      cell: ({ row }) => {
        const platform = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Link href={`/dashboard/platforms/${platform.id}/edit`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(platform.id)}
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
      data={platforms}
      searchKey="name"
      searchPlaceholder={tCommon('search')}
      noResultsText={tNoData('noData')}
    />
  );
}
