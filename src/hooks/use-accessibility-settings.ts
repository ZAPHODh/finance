"use client";

import { useEffect, useState } from "react";
import type { AccessibilitySettings } from "@/types/accessibility";
import { DEFAULT_ACCESSIBILITY_SETTINGS } from "@/config/accessibility";

export function useAccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/user/preferences");
        if (response.ok) {
          const data = await response.json();

          const accessibilitySettings: AccessibilitySettings = {
            keyboardShortcuts: data.keyboardShortcuts || DEFAULT_ACCESSIBILITY_SETTINGS.keyboardShortcuts,
            theme: (data.theme || DEFAULT_ACCESSIBILITY_SETTINGS.theme) as AccessibilitySettings["theme"],
            fontSize: (data.fontSize || DEFAULT_ACCESSIBILITY_SETTINGS.fontSize) as AccessibilitySettings["fontSize"],
            fontFamily: (data.fontFamily || DEFAULT_ACCESSIBILITY_SETTINGS.fontFamily) as AccessibilitySettings["fontFamily"],
            lineSpacing: (data.lineSpacing || DEFAULT_ACCESSIBILITY_SETTINGS.lineSpacing) as AccessibilitySettings["lineSpacing"],
            reducedMotion: data.reducedMotion ?? DEFAULT_ACCESSIBILITY_SETTINGS.reducedMotion,
            highContrast: data.highContrast ?? DEFAULT_ACCESSIBILITY_SETTINGS.highContrast,
          };

          setSettings(accessibilitySettings);
        } else {
          setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
        }
      } catch (error) {
        console.error("Failed to load accessibility settings:", error);
        setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  return { settings, isLoading };
}
