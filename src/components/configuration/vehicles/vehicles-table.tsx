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
import { deleteVehicle } from '@/app/[locale]/(financial)/dashboard/vehicles/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';

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
  const t = useScopedI18n('shared.configuration.vehicles');
  const tCommon = useScopedI18n('shared.common');
  const [isPending, startTransition] = useTransition();
  const tNoData = useScopedI18n('shared.sidebar.dashboard.breakdowns');

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

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="p-3 font-semibold text-foreground text-sm">
                {t('name')}
              </TableHead>
              <TableHead className="p-3 font-semibold text-foreground text-sm">
                {t('plate')}
              </TableHead>
              <TableHead className="p-3 font-semibold text-foreground text-sm">
                {t('model')}
              </TableHead>
              <TableHead className="p-3 text-right font-semibold text-foreground text-sm">
                {tCommon('actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-6 text-center text-muted-foreground">
                  {tNoData('noData')}
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="p-3 font-medium">
                    {vehicle.name}
                  </TableCell>
                  <TableCell className="p-3 text-muted-foreground">
                    {vehicle.plate || '-'}
                  </TableCell>
                  <TableCell className="p-3 text-muted-foreground">
                    {vehicle.model || '-'}
                  </TableCell>
                  <TableCell className="p-3 text-right">
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
