'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { X, Check, Pencil } from 'lucide-react';
import type { Driver } from '@/lib/schemas/onboarding';

export type { Driver };

interface DriverCardProps {
  driver: Driver;
  onUpdate: (driver: Driver) => void;
  onRemove: () => void;
  labels: {
    name: string;
    isSelf: string;
    isSelfDescription: string;
    save: string;
    cancel: string;
    edit: string;
    remove: string;
  };
}

export function DriverCard({ driver, onUpdate, onRemove, labels }: DriverCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDriver, setEditedDriver] = useState(driver);

  function handleSave() {
    if (editedDriver.name.trim()) {
      onUpdate(editedDriver);
      setIsEditing(false);
    }
  }

  function handleCancel() {
    setEditedDriver(driver);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <Card className="p-4 border-dashed">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`driver-name-${driver.name}`}>{labels.name}</FieldLabel>
            <Input
              id={`driver-name-${driver.name}`}
              value={editedDriver.name}
              onChange={(e) => setEditedDriver({ ...editedDriver, name: e.target.value })}
              placeholder={labels.name}
            />
          </Field>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`driver-isself-${driver.name}`}
              checked={editedDriver.isSelf || false}
              onCheckedChange={(checked) =>
                setEditedDriver({ ...editedDriver, isSelf: checked as boolean })
              }
            />
            <label
              htmlFor={`driver-isself-${driver.name}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {labels.isSelf}
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleSave} className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              {labels.save}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={handleCancel} className="flex-1">
              {labels.cancel}
            </Button>
          </div>
        </FieldGroup>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-dashed transition-colors hover:bg-accent/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-base">{driver.name}</h4>
          {driver.isSelf && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {labels.isSelf}
            </span>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <Button type="button" size="icon" variant="ghost" onClick={() => setIsEditing(true)} title={labels.edit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onRemove}
            className="hover:text-destructive"
            title={labels.remove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
