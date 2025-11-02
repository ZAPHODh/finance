'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { ReactNode } from 'react';

interface FilterPopoverProps {
  children: ReactNode;
  activeFilterCount: number;
  onClearAll: () => void;
  clearAllLabel: string;
  filtersLabel: string;
}

export function FilterPopover({
  children,
  activeFilterCount,
  onClearAll,
  clearAllLabel,
  filtersLabel,
}: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          {filtersLabel}
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 min-w-5 rounded-full px-1.5"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{filtersLabel}</h4>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-8 px-2 text-xs"
              >
                {clearAllLabel}
              </Button>
            )}
          </div>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}
