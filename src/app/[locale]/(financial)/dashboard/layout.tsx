import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/dashboard-01/app-sidebar"
import { SearchButton } from "@/components/dashboard-01/search-button"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/dashboard-01/site-header";
import { QuickActionsWrapper } from "@/components/dashboard-01/quick-actions-wrapper";
import { KeyboardShortcuts } from "@/components/dashboard-01/keyboard-shortcuts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getScopedI18n } from "@/locales/server";

export default async function FinancialLayout({
  children,
  driverDialog,
  vehicleDialog,
  platformDialog,
  expenseTypeDialog,
  paymentMethodDialog,
  expenseDialog,
  revenueDialog,
  budgetDialog,
  goalDialog,
  dailyEntryDialog,
}: {
  children: React.ReactNode;
  driverDialog: React.ReactNode;
  vehicleDialog: React.ReactNode;
  platformDialog: React.ReactNode;
  expenseTypeDialog: React.ReactNode;
  paymentMethodDialog: React.ReactNode;
  expenseDialog: React.ReactNode;
  revenueDialog: React.ReactNode;
  budgetDialog: React.ReactNode;
  goalDialog: React.ReactNode;
  dailyEntryDialog: React.ReactNode;
}) {
  const { user } = await getCurrentSession()
  if (!user) redirect('/login')
  const tDashboard = await getScopedI18n("dashboard")
  const tFinancial = await getScopedI18n("financial")
  const tBudgets = await getScopedI18n("ui.budgets")
  const tGoals = await getScopedI18n("ui.goals")
  const tDaily = await getScopedI18n("financial.dailyEntry")
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <KeyboardShortcuts />
      <AppSidebar user={user} searchComponent={<SearchButton />} variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <SiteHeader
            title={tDashboard("title")}
            mobileActions={
              <QuickActionsWrapper
                labels={{
                  newExpense: tFinancial("expenses.new"),
                  newRevenue: tFinancial("revenues.new"),
                  newBudget: tBudgets("new"),
                  newGoal: tGoals("new"),
                  newDailyEntry: tDaily("new"),
                  repeatLast: tDaily("repeatLast"),
                  noLastEntry: tDaily("noLastEntry"),
                  loadingLastEntry: tDaily("loadingLastEntry"),
                }}
              />
            }
            actions={
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/budgets/new">
                    <Plus className="h-4 w-4 mr-1" />
                    {tBudgets("new")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/goals/new">
                    <Plus className="h-4 w-4 mr-1" />
                    {tGoals("new")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="default">
                  <Link href="/dashboard/daily-entry/new">
                    <Plus className="h-4 w-4 mr-1" />
                    {tDaily("new")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/expenses/new">
                    {tFinancial("expenses.new")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/revenues/new">
                    {tFinancial("revenues.new")}
                  </Link>
                </Button>
              </>
            }
          />
          {children}
          {driverDialog}
          {vehicleDialog}
          {platformDialog}
          {expenseTypeDialog}
          {paymentMethodDialog}
          {expenseDialog}
          {revenueDialog}
          {budgetDialog}
          {goalDialog}
          {dailyEntryDialog}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
