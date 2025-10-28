'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table/data-table-components';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScopedI18n } from '@/locales/client';
import { AVAILABLE_REPORTS } from '@/lib/reports/types';
import { Eye } from 'lucide-react';
import type { ReportType } from '@prisma/client';

interface ReportListItem {
  id: string;
  type: ReportType;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export function ReportsList() {
  const t = useScopedI18n('shared.reports');
  const router = useRouter();

  const reportItems: ReportListItem[] = useMemo(() => {
    return AVAILABLE_REPORTS.map(report => ({
      id: report.id,
      type: report.type,
      name: report.name,
      description: report.description,
      icon: report.icon,
      category: report.partnerCategory || 'general',
    }));
  }, []);

  const columns = useMemo<ColumnDef<ReportListItem>[]>(() => [
    {
      accessorKey: 'icon',
      header: '',
      cell: ({ row }) => {
        const icon = row.original.icon;
        return (
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted text-xl md:text-2xl shrink-0">
            {icon}
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: t('type'),
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium truncate">{row.original.name}</span>
              {/* Badge visível no mobile, oculta no desktop (aparece na coluna própria) */}
              {category !== 'general' && (
                <Badge variant="outline" className="capitalize md:hidden shrink-0 text-xs">
                  {category.toLowerCase()}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-1">
              {row.original.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: t('category'),
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        if (category === 'general') return null;

        return (
          <Badge variant="outline" className="capitalize">
            {category.toLowerCase()}
          </Badge>
        );
      },
      // Ocultar coluna de categoria no mobile (badge aparece junto ao nome)
      meta: {
        className: 'hidden md:table-cell',
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex justify-end shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 md:h-9"
              onClick={() => router.push(`/dashboard/reports/${row.original.type.toLowerCase()}`)}
            >
              <Eye className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{t('view')}</span>
            </Button>
          </div>
        );
      },
    },
  ], [t, router]);

  return (
    <DataTable
      columns={columns}
      data={reportItems}
      searchKey="name"
      searchPlaceholder={t('searchReports')}
      noResultsText={t('noReports')}
    />
  );
}
