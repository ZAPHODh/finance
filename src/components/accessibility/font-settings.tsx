"use client";

import type { FontSize, FontFamily, LineSpacing } from "@/types/accessibility";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FONT_SIZE_OPTIONS, FONT_FAMILY_OPTIONS, LINE_SPACING_OPTIONS } from "@/config/accessibility";

interface FontSettingsProps {
  fontSize: FontSize;
  fontFamily: FontFamily;
  lineSpacing: LineSpacing;
  onFontSizeChange: (size: FontSize) => void;
  onFontFamilyChange: (family: FontFamily) => void;
  onLineSpacingChange: (spacing: LineSpacing) => void;
  labels: {
    fontSize: string;
    fontFamily: string;
    lineSpacing: string;
  };
}

export function FontSettings({
  fontSize,
  fontFamily,
  lineSpacing,
  onFontSizeChange,
  onFontFamilyChange,
  onLineSpacingChange,
  labels,
}: FontSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fontSize" className="text-base font-semibold">
          {labels.fontSize}
        </Label>
        <Select value={fontSize} onValueChange={(val) => onFontSizeChange(val as FontSize)}>
          <SelectTrigger id="fontSize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span style={{ fontSize: option.size }}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontFamily" className="text-base font-semibold">
          {labels.fontFamily}
        </Label>
        <Select value={fontFamily} onValueChange={(val) => onFontFamilyChange(val as FontFamily)}>
          <SelectTrigger id="fontFamily">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span style={{ fontFamily: option.fontFamily }}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lineSpacing" className="text-base font-semibold">
          {labels.lineSpacing}
        </Label>
        <Select value={lineSpacing} onValueChange={(val) => onLineSpacingChange(val as LineSpacing)}>
          <SelectTrigger id="lineSpacing">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LINE_SPACING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
