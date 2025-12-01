export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export interface KeyboardShortcuts {
  newDailyEntry: KeyboardShortcut;
  newRevenue: KeyboardShortcut;
  newExpense: KeyboardShortcut;
  repeatLast: KeyboardShortcut;
}

export type FontSize = "small" | "medium" | "large" | "x-large";
export type FontFamily = "default" | "dyslexic" | "mono";
export type LineSpacing = "normal" | "relaxed" | "loose";
export type Theme = "light" | "dark" | "system";

export interface AccessibilitySettings {
  keyboardShortcuts: KeyboardShortcuts;
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineSpacing: LineSpacing;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface FontSizeConfig {
  value: FontSize;
  label: string;
  size: string;
}

export interface FontFamilyConfig {
  value: FontFamily;
  label: string;
  fontFamily: string;
}

export interface LineSpacingConfig {
  value: LineSpacing;
  label: string;
  lineHeight: string;
}
