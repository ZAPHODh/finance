'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deleteDriver } from '@/app/[locale]/(financial)/dashboard/drivers/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';

interface Driver {
  id: string;
  name: string;
}

interface DriversTableProps {
  drivers: Driver[];
}

export function DriversTable({ drivers }: DriversTableProps) {
  const t = useScopedI18n('shared.configuration.drivers');
  const tCommon = useScopedI18n('shared.common');
  const tNoData = useScopedI18n('shared.sidebar.dashboard.breakdowns');
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

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="p-3 font-semibold text-foreground text-sm">
                {t('name')}
              </TableHead>
              <TableHead className="p-3 text-right font-semibold text-foreground text-sm">
                {tCommon('actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="p-6 text-center text-muted-foreground">
                  {tNoData('noData')}
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="p-3 font-medium">
                    {driver.name}
                  </TableCell>
                  <TableCell className="p-3 text-right">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
