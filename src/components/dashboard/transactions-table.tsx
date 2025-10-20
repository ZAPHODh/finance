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
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: 'revenue' | 'expense';
  date: Date;
  driver?: string;
  vehicle?: string;
  company?: string;
}

interface DayGroup {
  date: string;
  transactions: Transaction[];
  total: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  locale?: string;
}

interface DayRowProps {
  dayGroup: DayGroup;
  defaultOpen?: boolean;
  locale?: string;
}

function DayRow({ dayGroup, defaultOpen = false, locale = 'en' }: DayRowProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasTransactions = dayGroup.transactions.length > 0;
  const dateLocale = locale === 'pt' ? ptBR : enUS;

  const formattedDate = format(new Date(dayGroup.date), "EEEE, d 'de' MMMM", {
    locale: dateLocale,
  });

  return (
    <>
      <TableRow
        className={cn(
          'grid grid-cols-[40px_1fr_120px]',
          isOpen && 'border-b-0 bg-muted/40'
        )}
      >
        <TableCell className="p-0">
          <Button
            aria-label={isOpen ? 'Collapse row' : 'Expand row'}
            className={cn(
              'h-full w-full rounded-none p-3 text-muted-foreground transition-colors',
              hasTransactions && 'hover:bg-transparent hover:text-foreground'
            )}
            disabled={!hasTransactions}
            onClick={() => setIsOpen(!isOpen)}
            size="icon"
            variant="ghost"
          >
            {hasTransactions ? (
              isOpen ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell className="p-3 font-medium text-sm capitalize">
          {formattedDate}
        </TableCell>
        <TableCell
          className={cn(
            'p-3 text-right font-mono font-semibold text-sm',
            dayGroup.total >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}
        >
          R$ {dayGroup.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </TableCell>
      </TableRow>

      {hasTransactions && (
        <TableRow className="grid grid-cols-[40px_1fr_120px] border-b-0 hover:bg-transparent">
          <TableCell className="col-span-3 p-0" colSpan={3}>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="w-full border-border border-b bg-muted/20">
                <Table>
                  <TableHeader>
                    <TableRow className="grid grid-cols-[40px_1fr_120px_100px_120px] border-b-0 bg-muted/30">
                      <TableHead className="flex h-7 items-center border-border border-y px-3 py-1.5" />
                      <TableHead className="flex h-7 items-center border-border border-y px-3 py-1.5 text-xs">
                        Description
                      </TableHead>
                      <TableHead className="flex h-7 items-center border-border border-y px-3 py-1.5 text-xs">
                        Category
                      </TableHead>
                      <TableHead className="flex h-7 items-center border-border border-y px-3 py-1.5 text-xs">
                        Type
                      </TableHead>
                      <TableHead className="flex h-7 items-center justify-end border-border border-y px-3 py-1.5 text-right text-xs">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dayGroup.transactions.map((transaction) => (
                      <TableRow
                        className="grid grid-cols-[40px_1fr_120px_100px_120px]"
                        key={transaction.id}
                      >
                        <TableCell className="px-3 py-2" />
                        <TableCell className="px-3 py-2 font-medium text-xs">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-muted-foreground text-xs">
                          {transaction.category}
                        </TableCell>
                        <TableCell className="px-3 py-2 text-xs">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                              transaction.type === 'revenue'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            )}
                          >
                            {transaction.type === 'revenue' ? 'Revenue' : 'Expense'}
                          </span>
                        </TableCell>
                        <TableCell
                          className={cn(
                            'px-3 py-2 text-right font-mono font-semibold text-xs',
                            transaction.type === 'revenue'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          )}
                        >
                          {transaction.type === 'revenue' ? '+' : '-'}R${' '}
                          {Math.abs(transaction.amount).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function TransactionsTable({ transactions, locale = 'en' }: TransactionsTableProps) {
  // Group transactions by day
  const dayGroups = transactions.reduce((acc, transaction) => {
    const dateKey = format(transaction.date, 'yyyy-MM-dd');
    const existing = acc.find((g) => g.date === dateKey);

    const amount = transaction.type === 'revenue' ? transaction.amount : -transaction.amount;

    if (existing) {
      existing.transactions.push(transaction);
      existing.total += amount;
    } else {
      acc.push({
        date: dateKey,
        transactions: [transaction],
        total: amount,
      });
    }

    return acc;
  }, [] as DayGroup[]);

  // Sort by date descending
  dayGroups.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate grand total
  const grandTotal = dayGroups.reduce((sum, group) => sum + group.total, 0);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="grid grid-cols-[40px_1fr_120px] bg-muted/50">
              <TableHead className="p-3" />
              <TableHead className="p-3 font-semibold text-foreground text-sm">
                Date
              </TableHead>
              <TableHead className="p-3 text-right font-semibold text-foreground text-sm">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dayGroups.map((dayGroup, index) => (
              <DayRow
                defaultOpen={index === 0}
                key={dayGroup.date}
                dayGroup={dayGroup}
                locale={locale}
              />
            ))}
            {/* Grand Total Row */}
            <TableRow className="grid grid-cols-[40px_1fr_120px] border-t-2 bg-muted/30">
              <TableCell className="p-3" />
              <TableCell className="p-3 font-bold text-sm">Total</TableCell>
              <TableCell
                className={cn(
                  'p-3 text-right font-mono font-bold text-sm',
                  grandTotal >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
