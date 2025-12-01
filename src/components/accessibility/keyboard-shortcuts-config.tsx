"use client";

import { useState, useEffect } from "react";
import type { KeyboardShortcuts, KeyboardShortcut } from "@/types/accessibility";
import { Label } from "@/components/ui/label";
import { KeyboardShortcutInput } from "@/components/keyboard/keyboard-shortcut-input";
import { KEYBOARD_SHORTCUT_ACTIONS } from "@/config/accessibility";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface KeyboardShortcutsConfigProps {
  shortcuts: KeyboardShortcuts;
  onChange: (shortcuts: KeyboardShortcuts) => void;
  labels: {
    title: string;
    conflictWarning: string;
    change: string;
    set: string;
    clickToSet: string;
    pressAnyKey: string;
    actions: Record<string, { label: string; description: string }>;
  };
}

export function KeyboardShortcutsConfig({
  shortcuts,
  onChange,
  labels,
}: KeyboardShortcutsConfigProps) {
  const [conflicts, setConflicts] = useState<string[]>([]);

  useEffect(() => {
    const shortcutStrings = new Map<string, string[]>();

    Object.entries(shortcuts).forEach(([actionId, shortcut]) => {
      const str = `${shortcut.ctrl ? "ctrl+" : ""}${shortcut.shift ? "shift+" : ""}${
        shortcut.alt ? "alt+" : ""
      }${shortcut.key}`;

      if (!shortcutStrings.has(str)) {
        shortcutStrings.set(str, []);
      }
      shortcutStrings.get(str)!.push(actionId);
    });

    const conflictingActions: string[] = [];
    shortcutStrings.forEach((actions) => {
      if (actions.length > 1) {
        conflictingActions.push(...actions);
      }
    });

    setConflicts(conflictingActions);
  }, [shortcuts]);

  function handleShortcutChange(actionId: keyof KeyboardShortcuts, shortcut: KeyboardShortcut) {
    onChange({
      ...shortcuts,
      [actionId]: shortcut,
    });
  }

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{labels.title}</Label>

      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{labels.conflictWarning}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {KEYBOARD_SHORTCUT_ACTIONS.map((action) => (
          <KeyboardShortcutInput
            key={action.id}
            value={shortcuts[action.id as keyof KeyboardShortcuts]}
            onChange={(shortcut) =>
              handleShortcutChange(action.id as keyof KeyboardShortcuts, shortcut)
            }
            label={labels.actions[action.id]?.label || action.label}
            description={labels.actions[action.id]?.description || action.description}
            error={conflicts.includes(action.id) ? labels.conflictWarning : undefined}
            changeLabel={labels.change}
            setLabel={labels.set}
            clickToSetLabel={labels.clickToSet}
            pressAnyKeyLabel={labels.pressAnyKey}
          />
        ))}
      </div>
    </div>
  );
}
