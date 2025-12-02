'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Plus, Check, X, Sparkles } from 'lucide-react';
import { Vehicle } from './vehicle-card';

interface AddVehicleCardProps {
  onAdd: (vehicle: Vehicle) => void;
  vehicleCount: number;
  maxVehicles?: number;
  locale: string;
  labels: {
    addVehicle: string;
    upgradeToAddMore: string;
    name: string;
    plate: string;
    model: string;
    year: string;
    isPrimary: string;
    isPrimaryDescription: string;
    save: string;
    cancel: string;
  };
}

export function AddVehicleCard({ onAdd, vehicleCount, maxVehicles = 1, locale, labels }: AddVehicleCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    name: '',
    plate: '',
    model: '',
    year: undefined,
  });

  const isAtLimit = vehicleCount >= maxVehicles;

  function handleAdd() {
    if (newVehicle.name.trim()) {
      onAdd({
        name: newVehicle.name.trim(),
        plate: newVehicle.plate?.trim() || undefined,
        model: newVehicle.model?.trim() || undefined,
        year: newVehicle.year,
        isPrimary: newVehicle.isPrimary,
      });
      setNewVehicle({ name: '', plate: '', model: '', year: undefined, isPrimary: false });
      setIsAdding(false);
    }
  }

  function handleCancel() {
    setNewVehicle({ name: '', plate: '', model: '', year: undefined, isPrimary: false });
    setIsAdding(false);
  }

  if (!isAdding) {
    if (isAtLimit) {
      return (
        <Button
          type="button"
          variant="outline"
          className="w-full border-primary/50 text-primary hover:bg-primary/10"
          onClick={() => router.push(`/${locale}/pricing?from=onboarding`)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {labels.upgradeToAddMore}
        </Button>
      );
    }

    return (
      <Button type="button" variant="outline" className="w-full" onClick={() => setIsAdding(true)}>
        <Plus className="h-4 w-4 mr-2" />
        {labels.addVehicle}
      </Button>
    );
  }

  return (
    <Card className="p-4 border-dashed">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="new-vehicle-name">{labels.name}</FieldLabel>
          <Input
            id="new-vehicle-name"
            value={newVehicle.name}
            onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
            placeholder={labels.name}
            autoFocus
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="new-vehicle-plate">{labels.plate}</FieldLabel>
            <Input
              id="new-vehicle-plate"
              value={newVehicle.plate}
              onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
              placeholder={labels.plate}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-vehicle-model">{labels.model}</FieldLabel>
            <Input
              id="new-vehicle-model"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
              placeholder={labels.model}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="new-vehicle-year">{labels.year}</FieldLabel>
          <Input
            id="new-vehicle-year"
            type="number"
            value={newVehicle.year || ''}
            onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder={labels.year}
          />
        </Field>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="new-vehicle-isprimary"
            checked={newVehicle.isPrimary || false}
            onCheckedChange={(checked) =>
              setNewVehicle({ ...newVehicle, isPrimary: checked as boolean })
            }
          />
          <label
            htmlFor="new-vehicle-isprimary"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {labels.isPrimary}
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={handleAdd} className="flex-1">
            <Check className="h-4 w-4 mr-2" />
            {labels.save}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={handleCancel} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            {labels.cancel}
          </Button>
        </div>
      </FieldGroup>
    </Card>
  );
}
