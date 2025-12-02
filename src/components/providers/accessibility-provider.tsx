"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AccessibilitySettings, Theme } from "@/types/accessibility";
import { DEFAULT_ACCESSIBILITY_SETTINGS } from "@/config/accessibility";

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  isLoading: boolean;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

const defaultSettings: AccessibilitySettings = DEFAULT_ACCESSIBILITY_SETTINGS;

interface AccessibilityProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
}

export function AccessibilityProvider({
  children,
  initialTheme,
}: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    ...defaultSettings,
    theme: (initialTheme as Theme) || "system",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/user/preferences");
        if (response.ok) {
          const data = await response.json();
          if (data.preferences) {
            const loadedSettings: AccessibilitySettings = {
              theme: data.preferences.theme || defaultSettings.theme,
              fontSize: data.preferences.fontSize || defaultSettings.fontSize,
              fontFamily:
                data.preferences.fontFamily || defaultSettings.fontFamily,
              lineSpacing:
                data.preferences.lineSpacing || defaultSettings.lineSpacing,
              reducedMotion:
                data.preferences.reducedMotion || defaultSettings.reducedMotion,
              highContrast:
                data.preferences.highContrast || defaultSettings.highContrast,
              keyboardShortcuts:
                data.preferences.keyboardShortcuts ||
                defaultSettings.keyboardShortcuts,
            };
            setSettings(loadedSettings);
            applySettings(loadedSettings);
          }
        }
      } catch (error) {
        console.error("Failed to load accessibility settings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  function applySettings(settings: AccessibilitySettings) {
    const root = document.documentElement;

    // Apply font size
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "x-large": "20px",
    };
    root.style.setProperty(
      "--font-size-base",
      fontSizeMap[settings.fontSize] || fontSizeMap.medium
    );

    // Apply font family
    const fontFamilyMap = {
      default: "var(--font-sans)",
      dyslexic: "var(--font-dyslexic, var(--font-sans))",
      mono: "var(--font-mono)",
    };
    root.style.setProperty(
      "--font-family-base",
      fontFamilyMap[settings.fontFamily] || fontFamilyMap.default
    );

    // Apply line spacing
    const lineSpacingMap = {
      normal: "1.5",
      relaxed: "1.75",
      loose: "2",
    };
    root.style.setProperty(
      "--line-height-base",
      lineSpacingMap[settings.lineSpacing] || lineSpacingMap.normal
    );

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.setAttribute("data-reduce-motion", "true");
    } else {
      root.removeAttribute("data-reduce-motion");
    }

    // Apply high contrast
    if (settings.highContrast) {
      root.setAttribute("data-high-contrast", "true");
    } else {
      root.removeAttribute("data-high-contrast");
    }
  }

  function updateSettings(newSettings: Partial<AccessibilitySettings>) {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }

  return (
    <AccessibilityContext.Provider
      value={{ settings, isLoading, updateSettings }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibilityContext must be used within AccessibilityProvider"
    );
  }
  return context;
}
