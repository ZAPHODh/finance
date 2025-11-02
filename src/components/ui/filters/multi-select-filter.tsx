'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MultiSelectFilterProps {
  label: string;
  options: { id: string; name: string }[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function MultiSelectFilter({
  label,
  options,
  selectedIds,
  onSelectionChange,
}: MultiSelectFilterProps) {
  function handleToggle(id: string) {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelection);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {selectedIds.length > 0 && (
          <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5">
            {selectedIds.length}
          </Badge>
        )}
      </div>
      <ScrollArea className="h-40 rounded-md border p-2">
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedIds.includes(option.id)}
                onCheckedChange={() => handleToggle(option.id)}
              />
              <label
                htmlFor={option.id}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option.name}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
