'use client';

import { Input } from '@/components/ui/input';

interface AmountRangeFilterProps {
  minAmount: string;
  maxAmount: string;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
  label: string;
  minPlaceholder: string;
  maxPlaceholder: string;
}

export function AmountRangeFilter({
  minAmount,
  maxAmount,
  onMinAmountChange,
  onMaxAmountChange,
  label,
  minPlaceholder,
  maxPlaceholder,
}: AmountRangeFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder={minPlaceholder}
          value={minAmount}
          onChange={(e) => onMinAmountChange(e.target.value)}
          className="h-9"
        />
        <Input
          type="number"
          placeholder={maxPlaceholder}
          value={maxAmount}
          onChange={(e) => onMaxAmountChange(e.target.value)}
          className="h-9"
        />
      </div>
    </div>
  );
}
