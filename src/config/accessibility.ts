import type {
  AccessibilitySettings,
  FontSizeConfig,
  FontFamilyConfig,
  LineSpacingConfig,
  KeyboardShortcuts,
} from "@/types/accessibility";

export const DEFAULT_KEYBOARD_SHORTCUTS: KeyboardShortcuts = {
  newDailyEntry: { key: "d", ctrl: true },
  newRevenue: { key: "r", ctrl: true },
  newExpense: { key: "e", ctrl: true },
  repeatLast: { key: "d", ctrl: true, shift: true },
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  keyboardShortcuts: DEFAULT_KEYBOARD_SHORTCUTS,
  theme: "system",
  fontSize: "medium",
  fontFamily: "default",
  lineSpacing: "normal",
  reducedMotion: false,
  highContrast: false,
};

export const FONT_SIZE_OPTIONS: FontSizeConfig[] = [
  {
    value: "small",
    label: "Small",
    size: "14px",
  },
  {
    value: "medium",
    label: "Medium",
    size: "16px",
  },
  {
    value: "large",
    label: "Large",
    size: "18px",
  },
  {
    value: "x-large",
    label: "Extra Large",
    size: "20px",
  },
];

export const FONT_FAMILY_OPTIONS: FontFamilyConfig[] = [
  {
    value: "default",
    label: "Default",
    fontFamily: "var(--font-sans)",
  },
  {
    value: "dyslexic",
    label: "Dyslexic Friendly",
    fontFamily: "OpenDyslexic, var(--font-sans)",
  },
  {
    value: "mono",
    label: "Monospace",
    fontFamily: "var(--font-mono)",
  },
];

export const LINE_SPACING_OPTIONS: LineSpacingConfig[] = [
  {
    value: "normal",
    label: "Normal",
    lineHeight: "1.5",
  },
  {
    value: "relaxed",
    label: "Relaxed",
    lineHeight: "1.75",
  },
  {
    value: "loose",
    label: "Loose",
    lineHeight: "2",
  },
];

export const KEYBOARD_SHORTCUT_ACTIONS = [
  {
    id: "newDailyEntry",
    label: "New Daily Entry",
    description: "Open the daily entry dialog",
  },
  {
    id: "newRevenue",
    label: "New Revenue",
    description: "Navigate to new revenue page",
  },
  {
    id: "newExpense",
    label: "New Expense",
    description: "Navigate to new expense page",
  },
  {
    id: "repeatLast",
    label: "Repeat Last Entry",
    description: "Open daily entry with last entry data",
  },
] as const;
