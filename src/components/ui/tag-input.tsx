'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder,
  suggestions = [],
  onSuggestionClick,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  // Defensive: filter out non-string values
  const safeValue = value.filter((item) => typeof item === 'string');

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && safeValue.length > 0) {
      // Remove last tag when backspace on empty input
      onChange(safeValue.slice(0, -1));
    }
  }

  function addTag() {
    const trimmed = inputValue.trim();
    if (trimmed && !safeValue.includes(trimmed)) {
      onChange([...safeValue, trimmed]);
      setInputValue('');
    }
  }

  function removeTag(tagToRemove: string) {
    onChange(safeValue.filter((tag) => tag !== tagToRemove));
  }

  function handleSuggestionClick(suggestion: string) {
    if (!safeValue.includes(suggestion)) {
      onChange([...safeValue, suggestion]);
      onSuggestionClick?.(suggestion);
    }
  }

  // Filter out already added suggestions
  const availableSuggestions = suggestions.filter((s) => !safeValue.includes(s));

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative">
        <div
          className={cn(
            'min-h-[38px] rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors',
            'flex flex-wrap gap-2 items-center',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
          )}
        >
          {safeValue.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 hover:bg-secondary"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={safeValue.length === 0 ? placeholder : undefined}
            className="h-7 flex-1 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[120px] bg-transparent"
          />
        </div>
      </div>

      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableSuggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer hover:bg-secondary transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
