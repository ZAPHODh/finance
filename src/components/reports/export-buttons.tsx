'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileSpreadsheet, FileDown, Download } from 'lucide-react';
import { useScopedI18n } from '@/locales/client';
import { toast } from 'sonner';
import { exportReport } from '@/app/[locale]/(financial)/dashboard/reports/[type]/actions';
import type { ReportType } from '@prisma/client';
import type { ExportFormat } from '@/lib/reports/types';

interface ExportButtonsProps {
  reportType: ReportType;
  startDate: Date;
  endDate: Date;
  filters?: {
    driverId?: string;
    vehicleId?: string;
    expenseTypeId?: string;
    platformId?: string;
  };
  disabled?: boolean;
}

function downloadFile(base64Data: string, filename: string, mimeType: string) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function ExportButtons({
  reportType,
  startDate,
  endDate,
  filters,
  disabled
}: ExportButtonsProps) {
  const t = useScopedI18n('shared.reports');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();

  async function handleExport(format: ExportFormat) {
    startTransition(async () => {
      try {
        const result = await exportReport({
          reportType,
          format,
          startDate,
          endDate,
          filters,
        });

        downloadFile(result.data, result.filename, result.mimeType);
        toast.success(t('download'));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
    });
  }

  const formats: Array<{ format: ExportFormat; icon: any; label: string; available: boolean }> = [
    { format: 'pdf', icon: FileText, label: 'PDF', available: true },
    { format: 'excel', icon: FileSpreadsheet, label: 'Excel', available: true },
    { format: 'csv', icon: FileDown, label: 'CSV', available: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('export')}</CardTitle>
        <CardDescription>
          Escolha o formato para exportar o relatório
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {formats.map(({ format, icon: Icon, label, available }) => (
            <Button
              key={format}
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => handleExport(format)}
              disabled={!available || disabled || isPending}
            >
              <Icon className="h-8 w-8" />
              <span className="text-sm font-medium">{label}</span>
              {!available && (
                <span className="text-xs text-muted-foreground">Em breve</span>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
