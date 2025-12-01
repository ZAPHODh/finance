"use client";

import type { AccessibilitySettings } from "@/types/accessibility";
import { ThemeSelector } from "./theme-selector";
import { FontSettings } from "./font-settings";
import { KeyboardShortcutsConfig } from "./keyboard-shortcuts-config";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface AccessibilityStepProps {
  value: AccessibilitySettings;
  onChange: (settings: AccessibilitySettings) => void;
  labels: {
    title: string;
    description: string;
    theme: {
      title: string;
      light: string;
      dark: string;
      system: string;
    };
    font: {
      fontSize: string;
      fontFamily: string;
      lineSpacing: string;
    };
    shortcuts: {
      title: string;
      conflictWarning: string;
      actions: Record<string, { label: string; description: string }>;
    };
    reducedMotion: string;
    highContrast: string;
  };
}

export function AccessibilityStep({ value, onChange, labels }: AccessibilityStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{labels.title}</h2>
        <p className="text-muted-foreground mt-1">{labels.description}</p>
      </div>

      <Separator />

      <ThemeSelector
        value={value.theme}
        onChange={(theme) => onChange({ ...value, theme })}
        labels={labels.theme}
      />

      <Separator />

      <FontSettings
        fontSize={value.fontSize}
        fontFamily={value.fontFamily}
        lineSpacing={value.lineSpacing}
        onFontSizeChange={(fontSize) => onChange({ ...value, fontSize })}
        onFontFamilyChange={(fontFamily) => onChange({ ...value, fontFamily })}
        onLineSpacingChange={(lineSpacing) => onChange({ ...value, lineSpacing })}
        labels={labels.font}
      />

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reducedMotion" className="text-base font-semibold">
              {labels.reducedMotion}
            </Label>
          </div>
          <Switch
            id="reducedMotion"
            checked={value.reducedMotion}
            onCheckedChange={(checked) => onChange({ ...value, reducedMotion: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="highContrast" className="text-base font-semibold">
              {labels.highContrast}
            </Label>
          </div>
          <Switch
            id="highContrast"
            checked={value.highContrast}
            onCheckedChange={(checked) => onChange({ ...value, highContrast: checked })}
          />
        </div>
      </div>

      <Separator />

      <KeyboardShortcutsConfig
        shortcuts={value.keyboardShortcuts}
        onChange={(keyboardShortcuts) => onChange({ ...value, keyboardShortcuts })}
        labels={labels.shortcuts}
      />
    </div>
  );
}
