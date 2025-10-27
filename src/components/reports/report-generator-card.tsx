'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useScopedI18n } from '@/locales/client';
import { generateReport, type ReportFormData } from '@/app/[locale]/(financial)/dashboard/reports/actions';
import { toast } from 'sonner';
import { useTransition, useState } from 'react';
import { FileText, FileSpreadsheet, FileDown } from 'lucide-react';
import type { ReportType } from '@prisma/client';
import { format } from 'date-fns';

const REPORT_TYPES: ReportType[] = [
  'MONTHLY_SUMMARY',
  'DRE',
  'CARNE_LEAO',
  'EXPENSE_BREAKDOWN',
  'REVENUE_BREAKDOWN',
  'DRIVER_PERFORMANCE',
  'VEHICLE_PERFORMANCE',
];

const FORMATS = ['pdf', 'excel', 'csv'];

function getReportIcon(format: string) {
  switch (format) {
    case 'pdf':
      return <FileText className="h-5 w-5" />;
    case 'excel':
      return <FileSpreadsheet className="h-5 w-5" />;
    case 'csv':
      return <FileDown className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
}

export function ReportGeneratorCard() {
  const t = useScopedI18n('shared.reports');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    type: 'MONTHLY_SUMMARY' as ReportType,
    format: 'pdf',
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  async function handleGenerate() {
    if (!formData.type || !formData.format || !formData.startDate || !formData.endDate) {
      toast.error('Please fill all fields');
      return;
    }

    startTransition(async () => {
      try {
        const data: ReportFormData = {
          name: `${t(`types.${formData.type}`)} - ${formData.startDate} to ${formData.endDate}`,
          type: formData.type,
          format: formData.format,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        };

        await generateReport(data);
        toast.success(tCommon('createSuccess'));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : tCommon('error'));
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('generate')}</CardTitle>
        <CardDescription>
          {t(`descriptions.${formData.type}`)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reportType">{t('type')}</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as ReportType })}
          >
            <SelectTrigger id="reportType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`types.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">{t('startDate')}</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">{t('endDate')}</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('format')}</Label>
          <div className="grid grid-cols-3 gap-2">
            {FORMATS.map((format) => (
              <Button
                key={format}
                type="button"
                variant={formData.format === format ? 'default' : 'outline'}
                className="h-12"
                onClick={() => setFormData({ ...formData, format })}
              >
                <div className="flex flex-col items-center gap-1">
                  {getReportIcon(format)}
                  <span className="text-xs uppercase">{format}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? t('generating') : t('generate')}
        </Button>
      </CardContent>
    </Card>
  );
}
