'use client';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

export interface ActiveFilter {
  id: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface ActiveFilterBadgesProps {
  filters: ActiveFilter[];
  dateRange?: DateRange;
  onDateRangeRemove?: () => void;
  dateRangeLabel?: string;
  minAmount?: string;
  maxAmount?: string;
  onAmountRangeRemove?: () => void;
  amountRangeLabel?: string;
}

export function ActiveFilterBadges({
  filters,
  dateRange,
  onDateRangeRemove,
  dateRangeLabel,
  minAmount,
  maxAmount,
  onAmountRangeRemove,
  amountRangeLabel,
}: ActiveFilterBadgesProps) {
  const hasDateRange = dateRange?.from || dateRange?.to;
  const hasAmountRange = minAmount || maxAmount;
  const hasFilters = filters.length > 0 || hasDateRange || hasAmountRange;

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {hasDateRange && dateRangeLabel && onDateRangeRemove && (
        <Badge variant="secondary" className="gap-1 pr-1">
          <span className="text-xs">
            {dateRangeLabel}:{' '}
            {dateRange?.from
              ? format(dateRange.from, 'dd/MM/yyyy')
              : '...'}{' '}
            - {dateRange?.to ? format(dateRange.to, 'dd/MM/yyyy') : '...'}
          </span>
          <button
            onClick={onDateRangeRemove}
            className="ml-1 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      {hasAmountRange && amountRangeLabel && onAmountRangeRemove && (
        <Badge variant="secondary" className="gap-1 pr-1">
          <span className="text-xs">
            {amountRangeLabel}: {minAmount || '0'} - {maxAmount || '∞'}
          </span>
          <button
            onClick={onAmountRangeRemove}
            className="ml-1 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
      {filters.map((filter) => (
        <Badge key={filter.id} variant="secondary" className="gap-1 pr-1">
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <button
            onClick={filter.onRemove}
            className="ml-1 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
