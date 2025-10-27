import { getCurrentSession } from "@/lib/server/auth/session"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/dashboard-01/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/dashboard-01/site-header";
import { QuickActionsMenu } from "@/components/dashboard-01/quick-actions-menu";
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
}) {
  const { user } = await getCurrentSession()
  if (!user) redirect('/login')
  const tDashboard = await getScopedI18n("shared.sidebar.dashboard")
  const tFinancial = await getScopedI18n("shared.financial")
  const tBudgets = await getScopedI18n("shared.budgets")
  const tGoals = await getScopedI18n("shared.goals")
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <SiteHeader
            title={tDashboard("title")}
            mobileActions={
              <QuickActionsMenu
                labels={{
                  newExpense: tFinancial("expenses.new"),
                  newRevenue: tFinancial("revenues.new"),
                  newBudget: tBudgets("new"),
                  newGoal: tGoals("new"),
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
                <Button asChild size="sm">
                  <Link href="/dashboard/expenses/new">
                    {tFinancial("expenses.new")}
                  </Link>
                </Button>
                <Button asChild size="sm">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
