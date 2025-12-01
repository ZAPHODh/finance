"use client";

import { useState, useEffect, useRef } from "react";
import type { KeyboardShortcut } from "@/types/accessibility";
import { Button } from "@/components/ui/button";
import { KeyboardShortcutDisplay } from "./keyboard-shortcut-display";
import { X } from "lucide-react";

interface KeyboardShortcutInputProps {
  value: KeyboardShortcut;
  onChange: (shortcut: KeyboardShortcut) => void;
  label: string;
  description?: string;
  error?: string;
  changeLabel?: string;
  setLabel?: string;
  clickToSetLabel?: string;
  pressAnyKeyLabel?: string;
}

export function KeyboardShortcutInput({
  value,
  onChange,
  label,
  description,
  error,
  changeLabel = "Change",
  setLabel = "Set",
  clickToSetLabel = "Click to set",
  pressAnyKeyLabel = "Press any key combination...",
}: KeyboardShortcutInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [tempShortcut, setTempShortcut] = useState<KeyboardShortcut | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRecording) return;

    function handleKeyDown(e: KeyboardEvent) {
      e.preventDefault();
      e.stopPropagation();

      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) {
        return;
      }

      const newShortcut: KeyboardShortcut = {
        key: e.key.toLowerCase(),
        ctrl: e.ctrlKey || e.metaKey,
        shift: e.shiftKey,
        alt: e.altKey,
      };

      setTempShortcut(newShortcut);
      onChange(newShortcut);
      setIsRecording(false);
    }

    function handleBlur() {
      if (tempShortcut) {
        setIsRecording(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const currentRef = inputRef.current;
    currentRef?.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      currentRef?.removeEventListener("blur", handleBlur);
    };
  }, [isRecording, onChange, tempShortcut]);

  function handleStartRecording() {
    setIsRecording(true);
    setTempShortcut(null);
    inputRef.current?.focus();
  }

  function handleClear() {
    setTempShortcut(null);
    onChange({ key: "", ctrl: false, shift: false, alt: false });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">{label}</label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {value.key && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div
        ref={inputRef}
        tabIndex={0}
        className={`flex min-h-[3rem] items-center justify-between rounded-md border px-3 py-2 ${
          isRecording
            ? "border-primary bg-accent"
            : error
            ? "border-destructive"
            : "border-input"
        } cursor-pointer transition-colors hover:bg-accent/50`}
        onClick={handleStartRecording}
      >
        {isRecording ? (
          <span className="text-sm text-muted-foreground animate-pulse">
            {pressAnyKeyLabel}
          </span>
        ) : value.key ? (
          <KeyboardShortcutDisplay shortcut={value} />
        ) : (
          <span className="text-sm text-muted-foreground">{clickToSetLabel}</span>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleStartRecording();
          }}
        >
          {value.key ? changeLabel : setLabel}
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
