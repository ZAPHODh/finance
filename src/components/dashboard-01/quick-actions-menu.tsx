'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, RefreshCw } from "lucide-react";

interface QuickActionsMenuProps {
  labels: {
    newDailyEntry: string;
    repeatLast: string;
  };
  onNewDailyEntry: () => void;
  onRepeatLast?: () => void;
}

export function QuickActionsMenu({ labels, onNewDailyEntry, onRepeatLast }: QuickActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="default">
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onNewDailyEntry} className="cursor-pointer font-semibold">
          <CalendarDays className="h-4 w-4 mr-2" />
          {labels.newDailyEntry}
        </DropdownMenuItem>
        {onRepeatLast && (
          <DropdownMenuItem onClick={onRepeatLast} className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" />
            {labels.repeatLast}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
