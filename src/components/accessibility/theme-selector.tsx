"use client";

import type { Theme } from "@/types/accessibility";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, Moon, Monitor } from "lucide-react";

interface ThemeSelectorProps {
  value: Theme;
  onChange: (theme: Theme) => void;
  labels: {
    title: string;
    light: string;
    dark: string;
    system: string;
  };
}

export function ThemeSelector({ value, onChange, labels }: ThemeSelectorProps) {
  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: labels.light, icon: <Sun className="h-5 w-5" /> },
    { value: "dark", label: labels.dark, icon: <Moon className="h-5 w-5" /> },
    { value: "system", label: labels.system, icon: <Monitor className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{labels.title}</Label>
      <RadioGroup value={value} onValueChange={(val) => onChange(val as Theme)}>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((theme) => (
            <label
              key={theme.value}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent ${
                value === theme.value
                  ? "border-primary bg-accent"
                  : "border-muted"
              }`}
            >
              <RadioGroupItem
                value={theme.value}
                className="sr-only"
              />
              {theme.icon}
              <span className="text-sm font-medium">{theme.label}</span>
            </label>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
