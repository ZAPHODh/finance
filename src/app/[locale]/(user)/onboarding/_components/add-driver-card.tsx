'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Plus, Sparkles } from 'lucide-react';
import type { Driver } from './driver-card';

interface AddDriverCardProps {
  onAdd: (driver: Driver) => void;
  hasDrivers: boolean;
  driverCount: number;
  maxDrivers?: number;
  locale: string;
  labels: {
    addDriver: string;
    addAnother: string;
    upgradeToAddMore: string;
    name: string;
    isSelf: string;
    isSelfDescription: string;
    save: string;
    cancel: string;
  };
}

export function AddDriverCard({ onAdd, hasDrivers, driverCount, maxDrivers = 1, locale, labels }: AddDriverCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [newDriver, setNewDriver] = useState<Driver>({
    name: '',
    isSelf: false,
  });

  const isAtLimit = driverCount >= maxDrivers;

  function handleAdd() {
    if (newDriver.name.trim()) {
      onAdd(newDriver);
      setNewDriver({ name: '', isSelf: false });
      setIsAdding(false);
    }
  }

  function handleCancel() {
    setNewDriver({ name: '', isSelf: false });
    setIsAdding(false);
  }

  if (isAdding) {
    return (
      <Card className="p-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="new-driver-name">{labels.name}</FieldLabel>
            <Input
              id="new-driver-name"
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              placeholder={labels.name}
              autoFocus
            />
          </Field>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-driver-isself"
              checked={newDriver.isSelf || false}
              onCheckedChange={(checked) =>
                setNewDriver({ ...newDriver, isSelf: checked as boolean })
              }
            />
            <label
              htmlFor="new-driver-isself"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {labels.isSelf}
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleAdd} className="flex-1">
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

  if (isAtLimit) {
    return (
      <Card
        className="p-4 border border-primary/50 cursor-pointer transition-colors hover:bg-primary/10"
        onClick={() => router.push(`/${locale}/pricing?from=onboarding`)}
      >
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">{labels.upgradeToAddMore}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border cursor-pointer transition-colors hover:bg-accent/50" onClick={() => setIsAdding(true)}>
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Plus className="h-5 w-5" />
        <span className="font-medium">{hasDrivers ? labels.addAnother : labels.addDriver}</span>
      </div>
    </Card>
  );
}
