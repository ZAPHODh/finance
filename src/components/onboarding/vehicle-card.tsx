'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { X, Check, Pencil } from 'lucide-react';

export interface Vehicle {
  name: string;
  plate?: string;
  model?: string;
  year?: number;
  isPrimary?: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdate: (vehicle: Vehicle) => void;
  onRemove: () => void;
  labels: {
    name: string;
    plate: string;
    model: string;
    year: string;
    isPrimary: string;
    isPrimaryDescription: string;
    save: string;
    cancel: string;
    edit: string;
    remove: string;
  };
}

export function VehicleCard({ vehicle, onUpdate, onRemove, labels }: VehicleCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState(vehicle);

  function handleSave() {
    if (editedVehicle.name.trim()) {
      onUpdate(editedVehicle);
      setIsEditing(false);
    }
  }

  function handleCancel() {
    setEditedVehicle(vehicle);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <Card className="p-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`vehicle-name-${vehicle.name}`}>{labels.name}</FieldLabel>
            <Input
              id={`vehicle-name-${vehicle.name}`}
              value={editedVehicle.name}
              onChange={(e) => setEditedVehicle({ ...editedVehicle, name: e.target.value })}
              placeholder={labels.name}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor={`vehicle-plate-${vehicle.name}`}>{labels.plate}</FieldLabel>
              <Input
                id={`vehicle-plate-${vehicle.name}`}
                value={editedVehicle.plate || ''}
                onChange={(e) => setEditedVehicle({ ...editedVehicle, plate: e.target.value })}
                placeholder={labels.plate}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`vehicle-model-${vehicle.name}`}>{labels.model}</FieldLabel>
              <Input
                id={`vehicle-model-${vehicle.name}`}
                value={editedVehicle.model || ''}
                onChange={(e) => setEditedVehicle({ ...editedVehicle, model: e.target.value })}
                placeholder={labels.model}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor={`vehicle-year-${vehicle.name}`}>{labels.year}</FieldLabel>
            <Input
              id={`vehicle-year-${vehicle.name}`}
              type="number"
              value={editedVehicle.year || ''}
              onChange={(e) =>
                setEditedVehicle({ ...editedVehicle, year: e.target.value ? parseInt(e.target.value) : undefined })
              }
              placeholder={labels.year}
            />
          </Field>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`vehicle-isprimary-${vehicle.name}`}
              checked={editedVehicle.isPrimary || false}
              onCheckedChange={(checked) =>
                setEditedVehicle({ ...editedVehicle, isPrimary: checked as boolean })
              }
            />
            <label
              htmlFor={`vehicle-isprimary-${vehicle.name}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {labels.isPrimary}
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
    <Card className="p-4 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base">{vehicle.name}</h4>
            {vehicle.isPrimary && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {labels.isPrimary}
              </span>
            )}
          </div>
          <div className="space-y-0.5 text-sm text-muted-foreground">
            {vehicle.plate && (
              <p>
                <span className="font-medium">{labels.plate}:</span> {vehicle.plate}
              </p>
            )}
            {vehicle.model && (
              <p>
                <span className="font-medium">{labels.model}:</span> {vehicle.model}
              </p>
            )}
            {vehicle.year && (
              <p>
                <span className="font-medium">{labels.year}:</span> {vehicle.year}
              </p>
            )}
          </div>
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
