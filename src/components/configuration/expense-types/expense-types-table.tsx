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
import { deleteExpenseType } from '@/app/[locale]/(financial)/dashboard/expense-types/actions';
import { toast } from 'sonner';
import { useTransition } from 'react';

interface ExpenseType {
  id: string;
  name: string;
  icon: string | null;
}

interface ExpenseTypesTableProps {
  expenseTypes: ExpenseType[];
}

export function ExpenseTypesTable({ expenseTypes }: ExpenseTypesTableProps) {
  const t = useScopedI18n('shared.configuration.expenseTypes');
  const tCommon = useScopedI18n('shared.common');
  const tNoData = useScopedI18n('shared.sidebar.dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteExpenseType(id);
        toast.success(tCommon('deleteSuccess'));
      } catch (error) {
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
                {t('icon')}
              </TableHead>
              <TableHead className="p-3 font-semibold text-foreground text-sm">
                {t('name')}
              </TableHead>
              <TableHead className="p-3 text-right font-semibold text-foreground text-sm">
                {tCommon('actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenseTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="p-6 text-center text-muted-foreground">
                  {tNoData('noData')}
                </TableCell>
              </TableRow>
            ) : (
              expenseTypes.map((expenseType) => (
                <TableRow key={expenseType.id}>
                  <TableCell className="p-3 text-2xl">
                    {expenseType.icon || '📝'}
                  </TableCell>
                  <TableCell className="p-3 font-medium">
                    {expenseType.name}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/expense-types/${expenseType.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expenseType.id)}
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
