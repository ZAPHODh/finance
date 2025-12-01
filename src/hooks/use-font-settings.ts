"use client";

import { useEffect } from "react";
import type { FontSize, FontFamily, LineSpacing } from "@/types/accessibility";
import { FONT_SIZE_OPTIONS, FONT_FAMILY_OPTIONS, LINE_SPACING_OPTIONS } from "@/config/accessibility";

interface FontSettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineSpacing: LineSpacing;
}

export function useFontSettings(settings: FontSettings) {
  useEffect(() => {
    const root = document.documentElement;

    const fontSizeConfig = FONT_SIZE_OPTIONS.find((opt) => opt.value === settings.fontSize);
    if (fontSizeConfig) {
      root.style.setProperty("--font-size-base", fontSizeConfig.size);
    }

    const fontFamilyConfig = FONT_FAMILY_OPTIONS.find((opt) => opt.value === settings.fontFamily);
    if (fontFamilyConfig) {
      root.style.setProperty("--font-family-base", fontFamilyConfig.fontFamily);
    }

    const lineSpacingConfig = LINE_SPACING_OPTIONS.find((opt) => opt.value === settings.lineSpacing);
    if (lineSpacingConfig) {
      root.style.setProperty("--line-height-base", lineSpacingConfig.lineHeight);
    }
  }, [settings.fontSize, settings.fontFamily, settings.lineSpacing]);
}
