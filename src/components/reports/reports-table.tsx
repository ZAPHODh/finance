'use client';

import { Button } from '@/components/ui/button';
import { useScopedI18n } from '@/locales/client';
import { Download, Trash } from 'lucide-react';
import { deleteReport } from '@/app/[locale]/(financial)/dashboard/reports/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { format } from 'date-fns';
import type { ReportType } from '@prisma/client';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { ColumnDef } from '@tanstack/react-table';

interface Report {
  id: string;
  name: string;
  type: ReportType;
  format: string;
  startDate: Date;
  endDate: Date;
  fileUrl: string | null;
  createdAt: Date;
}

interface ReportsTableProps {
  reports: Report[];
}

export function ReportsTable({ reports }: ReportsTableProps) {
  const t = useScopedI18n('shared.reports');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteReport(id);
        toast.success(tCommon('deleteSuccess'));
      } catch {
        toast.error(tCommon('error'));
      }
    });
  }

  function handleDownload(report: Report) {
    if (report.fileUrl) {
      window.open(report.fileUrl, '_blank');
    } else {
      toast.error(t('fileNotAvailable'));
    }
  }

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'type',
      header: t('type'),
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return <div>{t(`types.${type}` as any)}</div>;
      },
    },
    {
      accessorKey: 'format',
      header: t('format'),
      cell: ({ row }) => <div className="uppercase">{row.getValue('format')}</div>,
    },
    {
      id: 'period',
      header: t('period'),
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div>
            {format(new Date(report.startDate), 'dd/MM/yyyy')} -{' '}
            {format(new Date(report.endDate), 'dd/MM/yyyy')}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('createdAt'),
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue('createdAt')), 'dd/MM/yyyy HH:mm')}</div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{tCommon('actions')}</div>,
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(report)}
              disabled={!report.fileUrl}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(report.id)}
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
      data={reports}
      searchKey="name"
      searchPlaceholder={tCommon('search')}
      noResultsText={t('noReports')}
    />
  );
}
