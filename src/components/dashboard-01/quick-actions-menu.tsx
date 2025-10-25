'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Target, PiggyBank } from "lucide-react";
import Link from "next/link";

interface QuickActionsMenuProps {
  labels: {
    newExpense: string;
    newRevenue: string;
    newBudget: string;
    newGoal: string;
  };
}

export function QuickActionsMenu({ labels }: QuickActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="default">
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/dashboard/expenses/new" className="cursor-pointer">
            <TrendingDown className="h-4 w-4 mr-2" />
            {labels.newExpense}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/revenues/new" className="cursor-pointer">
            <TrendingUp className="h-4 w-4 mr-2" />
            {labels.newRevenue}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/budgets/new" className="cursor-pointer">
            <PiggyBank className="h-4 w-4 mr-2" />
            {labels.newBudget}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/goals/new" className="cursor-pointer">
            <Target className="h-4 w-4 mr-2" />
            {labels.newGoal}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
