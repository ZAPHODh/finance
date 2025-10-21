'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, isWithinInterval } from 'date-fns';
import { TransactionsTable } from './transactions-table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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

interface TransactionsSectionProps {
  transactions: Transaction[];
  locale?: string;
}

export function TransactionsSection({ transactions, locale = 'en' }: TransactionsSectionProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const filteredTransactions = transactions.filter((transaction) => {
    if (!date?.from) return true;
    if (!date?.to) {
      return transaction.date >= date.from;
    }
    return isWithinInterval(transaction.date, { start: date.from, end: date.to });
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
          <p className="text-sm text-muted-foreground">
            View and manage your transactions by date
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[300px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <TransactionsTable transactions={filteredTransactions} locale={locale} />
    </div>
  );
}
