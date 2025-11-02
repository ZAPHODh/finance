'use client';

import { useMemo } from 'react';
import MultipleSelector, { Option } from '@/components/ui/multiselect';

interface MultiSelectFilterProps {
  label: string;
  options: { id: string; name: string }[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  placeholder?: string;
}

export function MultiSelectFilter({
  label,
  options,
  selectedIds,
  onSelectionChange,
  placeholder,
}: MultiSelectFilterProps) {
  const multiselectOptions: Option[] = useMemo(
    () =>
      options.map((option) => ({
        value: option.id,
        label: option.name,
      })),
    [options]
  );

  const selectedOptions: Option[] = useMemo(
    () =>
      selectedIds
        .map((id) => options.find((opt) => opt.id === id))
        .filter((opt): opt is { id: string; name: string } => opt !== undefined)
        .map((opt) => ({
          value: opt.id,
          label: opt.name,
        })),
    [selectedIds, options]
  );

  function handleChange(selectedOptions: Option[]) {
    onSelectionChange(selectedOptions.map((opt) => opt.value));
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <MultipleSelector
        value={selectedOptions}
        onChange={handleChange}
        defaultOptions={multiselectOptions}
        placeholder={placeholder || `Select ${label.toLowerCase()}...`}
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
        hidePlaceholderWhenSelected
      />
    </div>
  );
}
