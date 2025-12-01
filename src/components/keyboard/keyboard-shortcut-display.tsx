import type { KeyboardShortcut } from "@/types/accessibility";
import { Badge } from "@/components/ui/badge";

interface KeyboardShortcutDisplayProps {
  shortcut: KeyboardShortcut;
  className?: string;
}

export function KeyboardShortcutDisplay({
  shortcut,
  className,
}: KeyboardShortcutDisplayProps) {
  const keys = [];

  if (shortcut.ctrl) keys.push("Ctrl");
  if (shortcut.shift) keys.push("Shift");
  if (shortcut.alt) keys.push("Alt");
  if (shortcut.meta) keys.push("⌘");
  keys.push(shortcut.key.toUpperCase());

  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      {keys.map((key, index) => (
        <span key={index} className="flex items-center gap-1">
          <Badge variant="secondary" className="px-2 py-1 text-xs font-mono">
            {key}
          </Badge>
          {index < keys.length - 1 && <span className="text-muted-foreground">+</span>}
        </span>
      ))}
    </div>
  );
}
